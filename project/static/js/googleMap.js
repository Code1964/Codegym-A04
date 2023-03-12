'use strict';

// 国単位か都道府県単位か市区町村単位かを変えるための変数
let searchType = "country";
// 現在の検索ステータスを文字で表示するための変数
let message = "国";
// マップのズームを調整するために使用
let zoom = 5;
let changeZoom;
// 県や国ではなく、場所の名前を挿入するための変数
let placeName = "";

// 情報ウィンドウ
let infoWindow;
// 現在の位置情報
let currentLatLng;

/** DOM 要素を非表示にし、オプションで focusEl にフォーカスする */
function hideElement(el, focusEl) {
  el.style.display = 'none';
  if (focusEl) focusEl.focus();
}

/** 非表示の DOM 要素を表示し、オプションで focusEl にフォーカスする */
function showElement(el, focusEl) {
  el.style.display = 'block';
  if (focusEl) focusEl.focus();
}

/** スクロールして表示できないコンテンツが DOM 要素に含まれているかどうかを判断する */
function hasHiddenContent(el) {
  const noscroll = window.getComputedStyle(el).overflowY.includes('hidden');
  return noscroll && el.scrollHeight > el.clientHeight;
}

/** 打った文字を大文字にし、スペースに置き換えて、場所の種類の文字列をフォーマットする */
function formatPlaceType(str) {
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalized.replace(/_/g, ' ');
}

/**
 * PlaceOpeningHours オブジェクトから日ごとの営業時間の配列を構築する
 * 同じ時間の隣接する曜日が 1つの要素に折りたたまれる
 */
function parseDaysHours(openingHours) {
  const daysHours = openingHours.weekday_text.map((e) => e.split(/\:\s+/)).map((e) => ({'days': e[0].substr(0, 3), 'hours': e[1]}));
  for (let i = 1; i < daysHours.length; i++) {
    if (daysHours[i - 1].hours === daysHours[i].hours) {
      if (daysHours[i - 1].days.indexOf('-') !== -1) {
        daysHours[i - 1].days =
            daysHours[i - 1].days.replace(/\w+$/, daysHours[i].days);
      } else {
        daysHours[i - 1].days += ' - ' + daysHours[i].days;
      }
      daysHours.splice(i--, 1);
    }
  }
  return daysHours;
}

/** ウィジェットのロード時に表示する POI の数 */
const ND_NUM_PLACES_INITIAL = 5;

/** 「さらに表示」ボタンがクリックされたときに表示される追加の POI の数 */
const ND_NUM_PLACES_SHOW_MORE = 5;

/** 詳細パネルに表示する場所の写真の最大数 */
const ND_NUM_PLACE_PHOTOS_MAX = 6;

/** デフォルトのマップ POI ピンが表示される最小ズームレベル */
const ND_DEFAULT_POI_MIN_ZOOM = 5;

/** ピンを立てたときのアイコン */
// 他のアイコンは https://fonts.google.com/icons にある
const ND_MARKER_ICONS_BY_TYPE = {
  '_default': 'circle',
  'restaurant': 'restaurant',
  'cafe': 'local_cafe',
  'bar': 'local_bar',
  'park': 'park',
  'museum': 'museum',
  'supermarket': 'local_grocery_store',
  'clothing_store': 'local_mall',
  'home_goods_store': 'local_mall',
  'shopping_mall': 'local_mall',
  'secondary_school': 'school',
  'bank': 'money',
  'tourist_attraction': 'local_see',
  'laundry': 'local_laundry_service',
  'post_office': 'local_post_office',
  'library': 'local_library',
  'hospital': 'local_hospital',
  'police': 'local_police',
  'fire_station': 'local_fire_department',
};

  /**
 * Neighborhood Discovery ウィジェットのインスタンスを次のように定義します。
 * Maps ライブラリが読み込まれるとインスタンス化されます。
 */
function NeighborhoodDiscovery(configuration) {
  const widget = this;
  const widgetEl = document.querySelector('.neighborhood-discovery');

  // 最初の位置情報を追加
  widget.center = configuration.mapOptions.center;
  // ピンの位置情報を追加
  widget.places = configuration.pois || [];

  // コア機能を初期化 --------------------------------------
  initializeMap();
  initializePlaceDetails();
  initializeSidePanel();

  // 追加機能を初期化 ----------------------------------
  initializeSearchInput();

  // 初期化関数の定義 ------------------------------------
  /** インタラクティブ マップを初期化し、場所マーカーを追加します。 */
  function initializeMap() {
    // ピン間で共有する情報ウィンドウを作成する
    infoWindow = new google.maps.InfoWindow({
      content: "",
      disableAutoPan: true,
    });
    const mapOptions = configuration.mapOptions;
    widget.mapBounds = new google.maps.Circle({
        center: widget.center,
        radius: configuration.mapRadius,
      }).getBounds();
    // 最初のスタート地点を表記
    mapOptions.restriction = {latLngBounds: widget.center};
    // 地図・航空写真ボタンの配置を右にする
    mapOptions.mapTypeControlOptions = {position: google.maps.ControlPosition.TOP_RIGHT};
    // 地図のタイプ(航空写真+ラベル付き)
    mapOptions.mapTypeId = google.maps.MapTypeId.HYBRID;
    widget.map = new google.maps.Map(widgetEl.querySelector('.map'), mapOptions);
    // ボタンのZoom変更に使用
    changeZoom = widget.map;
    // 住所を逆ジオコーディングで取得する
    let geocoder = new google.maps.Geocoder();
    // htmlにあるinputの中身があるないかを判断する
    let input = document.getElementById("latlng").value;
    if (input !== undefined && input !== '') {}
    // indexからの値がない場合の処理
    else {
      // 既存の位置を入力する
      document.getElementById("latlng").value = "35.6761919, 139.6503106";
    }
    // 情報ウインドウ表示
    infoWindow.open(widget.map);
    // 地図が読み込まれたときの処理を行うコード
    google.maps.event.addListenerOnce(widget.map, 'idle', function() {
      geocodeLatLng(geocoder, widget.map);
    });
    // 位置情報を取得できた場合とできなかった場合の処理
    // geocodeLatLngよりあとでないと位置情報を取得できない
    // TODO: 以下、重複している部分があるのでfunction化する
    if (navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {
        // 地図が読み込まれたときの処理を行うコード
        google.maps.event.addListenerOnce(widget.map, 'idle', function() {
          geocodeLatLng(geocoder, widget.map);
        });
        // 取得したpositionから緯度経度を設定
        currentLatLng = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        // インフォウインドウの表示場所
        infoWindow.setPosition(currentLatLng);
        widget.map.panTo(currentLatLng);
        // インフォウインドウの表示文字
        infoWindow.setContent('あなたの現在地はこちら！！');
      }, () => {
        // 情報ウインドウを入力する
        infoWindow.setPosition(widget.center);
        infoWindow.setContent('位置情報の取得を拒否しました');
        widget.map.panTo(widget.center);
      });
    } else {
      infoWindow.setPosition(widget.center);
      infoWindow.setContent('位置情報を取得できませんでした');
      widget.map.panTo(widget.center);
    }
    // TODO: ここまで
    widget.map.fitBounds(widget.mapBounds, /* padding= */ 0);
    widget.map.addListener('click', (e) => {
      // クリックした場所にカメラが移動する
      let clickLatlng = e.latLng;
      widget.map.panTo(clickLatlng);
      clickNoArea(clickLatlng, geocoder);
      // ユーザーがベースマップから POI ピンをクリックしたかどうかを確認する
      if (e.placeId) {
        e.stop();
        widget.selectPlaceById(e.placeId);
      }
    });
    widget.map.addListener('zoom_changed', () => {
      // 地図のスタイルをカスタマイズして、ズーム レベルに基づいてデフォルトの POI ピンまたはテキストを表示/非表示にする
      const hideDefaultPoiPins = widget.map.getZoom() < ND_DEFAULT_POI_MIN_ZOOM;
      widget.map.setOptions({
        styles: [{
          featureType: 'poi',
          elementType: hideDefaultPoiPins ? 'labels' : 'labels.text',
          stylers: [{visibility: 'off'}],
        }],
      });
    });
    const markerPath = widgetEl.querySelector('.marker-pin path').getAttribute('d');
    const drawMarker = function(title, position, fillColor, strokeColor, labelText) {
      return new google.maps.Marker({
        title: title,
        position: position,
        map: widget.map,
        icon: {
          path: markerPath,
          fillColor: fillColor,
          fillOpacity: 1,
          strokeColor: strokeColor,
          anchor: new google.maps.Point(13, 35),
          labelOrigin: new google.maps.Point(13, 13),
        },
        label: {
          text: labelText,
          color: 'white',
          fontSize: '16px',
          fontFamily: 'Material Icons',
        },
      });
    };

    // 指定された Place オブジェクトにマーカーを追加する
    widget.addPlaceMarker = function(place) {
      place.marker = drawMarker(place.name, place.coords, '#EA4335', '#C5221F', place.icon);
      place.marker.addListener('click', () => {
        // Place を選択する処理
        void widget.selectPlaceById(place.placeId);
        // グローバル変数に代入
        placeName = place.name
        // 取得した住所をformのinputにセットする
        document.querySelector('input[name="placeName"]').value = placeName;
      });
    };

    // 初期設定の位置からスタート
    widget.updateBounds = function() {
      const bounds = new google.maps.LatLngBounds(widget.center);
      widget.map.fitBounds(bounds, /* padding= */ 200);
    };

    // オートコンプリート検索から場所を強調表示するために使用されるマーカー
    widget.selectedPlaceMarker = new google.maps.Marker({title: 'Point of Interest'});
  }

  /** ウィジェットの Place Details サービスを初期化 */
  function initializePlaceDetails() {
    const detailsService = new google.maps.places.PlacesService(widget.map);
    const placeIdsToDetails = new Map();  // プレイスの結果を保持するオブジェクトを作成

    for (let place of widget.places) {
      placeIdsToDetails.set(place.placeId, place);
      place.fetchedFields = new Set(['place_id']);
    }

    widget.fetchPlaceDetails = function(placeId, fields, callback) {
      if (!placeId || !fields) return;
      // Place オブジェクトにフィールドが存在するかどうかを確認
      let place = placeIdsToDetails.get(placeId);
      if (!place) {
        place = {placeId: placeId, fetchedFields: new Set(['place_id'])};
        placeIdsToDetails.set(placeId, place);
      }
      const missingFields = fields.filter((field) => !place.fetchedFields.has(field));
      if (missingFields.length === 0) {
        callback(place);
        return;
      }

      const request = {placeId: placeId, fields: missingFields};
      let retryCount = 0;
      const processResult = function(result, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          // クエリの上限に達した場合は、別の呼び出しを行う前に待機する
          // 指数バックオフを使用して、連続する各再試行の待機時間を増やす
          // 試行が 5 回失敗すると終了する
          if (status === google.maps.places.PlacesServiceStatus.OVER_QUERY_LIMIT &&
              retryCount < 5) {
            const delay = (Math.pow(2, retryCount) + Math.random()) * 500;
            setTimeout(() => void detailsService.getDetails(request, processResult), delay);
            retryCount++;
          }
          return;
        }

        // 基本的な詳細(左側に出てるやつ)
        if (result.name) place.name = result.name;
        if (result.geometry) place.coords = result.geometry.location;
        if (result.formatted_address) place.address = result.formatted_address;
        // ディスプレイサイズによって表示サイズを変える
        if (result.photos) {
          place.photos = result.photos.map((photo) => ({
            urlSmall: photo.getUrl({maxWidth: 200, maxHeight: 200}),
            urlLarge: photo.getUrl({maxWidth: 1200, maxHeight: 1200}),
            attrs: photo.html_attributions,
          })).slice(0, ND_NUM_PLACE_PHOTOS_MAX);
        }
        if (result.types) {
          place.type = formatPlaceType(result.types[0]);
          place.icon = ND_MARKER_ICONS_BY_TYPE['_default'];
          for (let type of result.types) {
            if (type in ND_MARKER_ICONS_BY_TYPE) {
              place.type = formatPlaceType(type);
              place.icon = ND_MARKER_ICONS_BY_TYPE[type];
              break;
            }
          }
        }
        if (result.url) place.url = result.url;

        // 連絡先の詳細
        if (result.website) {
          place.website = result.website;
          const url = new URL(place.website);
          place.websiteDomain = url.hostname;
        }
        if (result.formatted_phone_number) place.phoneNumber = result.formatted_phone_number;
        if (result.opening_hours) place.openingHours = parseDaysHours(result.opening_hours);
        for (let field of missingFields) {
          place.fetchedFields.add(field);
        }
        callback(place);
      };

      // Place Autocomplete の結果があればそれを表示する
      if (widget.placeIdsToAutocompleteResults) {
        const autoCompleteResult = widget.placeIdsToAutocompleteResults.get(placeId);
        if (autoCompleteResult) {
          processResult(autoCompleteResult, google.maps.places.PlacesServiceStatus.OK);
          return;
        }
      }
      detailsService.getDetails(request, processResult);
    };
  }

  /** 精選された POI の結果を保持するサイド パネルを初期化 */
  function initializeSidePanel() {
    const placesPanelEl = widgetEl.querySelector('.places-panel');
    const detailsPanelEl = widgetEl.querySelector('.details-panel');
    const placeResultsEl = widgetEl.querySelector('.place-results-list');
    const showMoreButtonEl = widgetEl.querySelector('.show-more-button');
    const photoModalEl = widgetEl.querySelector('.photo-modal');
    const detailsTemplate = Handlebars.compile(
        document.getElementById('nd-place-details-tmpl').innerHTML);
    const resultsTemplate = Handlebars.compile(
        document.getElementById('nd-place-results-tmpl').innerHTML);

    // 指定された POI 写真をモーダルで表示する
    const showPhotoModal = function(photo, placeName) {
      const prevFocusEl = document.activeElement;
      const imgEl = photoModalEl.querySelector('img');
      imgEl.src = photo.urlLarge;
      const backButtonEl = photoModalEl.querySelector('.back-button');
      backButtonEl.addEventListener('click', () => {
        hideElement(photoModalEl, prevFocusEl);
        imgEl.src = '';
      });
      photoModalEl.querySelector('.photo-place').innerHTML = placeName;
      photoModalEl.querySelector('.photo-attrs span').innerHTML = photo.attrs;
      const attributionEl = photoModalEl.querySelector('.photo-attrs a');
      if (attributionEl) attributionEl.setAttribute('target', '_blank');
      photoModalEl.addEventListener('click', (e) => {
        if (e.target === photoModalEl) {
          hideElement(photoModalEl, prevFocusEl);
          imgEl.src = '';
        }
      });
      showElement(photoModalEl, backButtonEl);
    };

    // ID で場所を選択し、詳細を表示
    let selectedPlaceId;
    widget.selectPlaceById = function(placeId, panToMarker) {
      if (selectedPlaceId === placeId) return;
      selectedPlaceId = placeId;
      const prevFocusEl = document.activeElement;
      const showDetailsPanel = function(place) {
        detailsPanelEl.innerHTML = detailsTemplate(place);
        const backButtonEl = detailsPanelEl.querySelector('.back-button');
        backButtonEl.addEventListener('click', () => {
          hideElement(detailsPanelEl, prevFocusEl);
          selectedPlaceId = undefined;
          widget.selectedPlaceMarker.setMap(null);
        });
        detailsPanelEl.querySelectorAll('.photo').forEach((photoEl, i) => {
          photoEl.addEventListener('click', () => {
            showPhotoModal(place.photos[i], place.name);
          });
        });
        showElement(detailsPanelEl, backButtonEl);
        detailsPanelEl.scrollTop = 0;
      };
      const processResult = function(place) {
        if (place.marker) {
          widget.selectedPlaceMarker.setMap(null);
        } else {
          widget.selectedPlaceMarker.setPosition(place.coords);
          widget.selectedPlaceMarker.setMap(widget.map);
        }
        if (panToMarker) {
          widget.map.panTo(place.coords);
        }
        // 住所がある場所の名前をセットする処理
        document.querySelector('input[name="placeName"]').value = place.name;        showDetailsPanel(place);
      };

      widget.fetchPlaceDetails(placeId, [
        'name', 'types', 'geometry.location', 'formatted_address', 'photo', 'url',
        'website', 'formatted_phone_number', 'opening_hours',
      ], processResult);
    };

    // 指定されたプレイス オブジェクトをレンダリングし、POI リストに追加
    const renderPlaceResults = function(places, startIndex) {
      placeResultsEl.insertAdjacentHTML('beforeend', resultsTemplate({places: places}));
      placeResultsEl.querySelectorAll('.place-result').forEach((resultEl, i) => {
        const place = places[i - startIndex];
        if (!place) return;
        // アイテムのどこかをクリックすると、その場所が選択される
        // さらに、この動作を行うボタン要素を作成
        // タブ ナビゲーションでアクセス可能
        resultEl.addEventListener('click', () => {
          widget.selectPlaceById(place.placeId, /* panToMarker= */ true);
        });
        resultEl.querySelector('.name').addEventListener('click', (e) => {
          widget.selectPlaceById(place.placeId, /* panToMarker= */ true);
          e.stopPropagation();
        });
        resultEl.querySelector('.photo').addEventListener('click', (e) => {
          showPhotoModal(place.photos[0], place.name);
          e.stopPropagation();
        });
        widget.addPlaceMarker(place);
      });
    };
    // POI リストに表示する次の Place オブジェクトのインデックス。
    let nextPlaceIndex = 0;

    // 次の N 桁の基本情報を取得して表示する
    const showNextPlaces = function(n) {
      const nextPlaces = widget.places.slice(nextPlaceIndex, nextPlaceIndex + n);
      if (nextPlaces.length < 1) {
        hideElement(showMoreButtonEl);
        return;
      }
      showMoreButtonEl.disabled = true;
      // 終了していない Places 呼び出しの数を追跡する
      let count = nextPlaces.length;
      for (let place of nextPlaces) {
        const processResult = function(place) {
          count--;
          if (count > 0) return;
          renderPlaceResults(nextPlaces, nextPlaceIndex);
          nextPlaceIndex += n;
          widget.updateBounds(widget.places.slice(0, nextPlaceIndex));
          const hasMorePlacesToShow = nextPlaceIndex < widget.places.length;
          if (hasMorePlacesToShow || hasHiddenContent(placesPanelEl)) {
            showElement(showMoreButtonEl);
            showMoreButtonEl.disabled = false;
          } else {
            hideElement(showMoreButtonEl);
          }
        };
        widget.fetchPlaceDetails(place.placeId, [
          'name', 'types', 'geometry.location', 'photo',
        ], processResult);
      }
    };
    showNextPlaces(ND_NUM_PLACES_INITIAL);

    showMoreButtonEl.addEventListener('click', () => {
      placesPanelEl.classList.remove('no-scroll');
      showMoreButtonEl.classList.remove('sticky');
      showNextPlaces(ND_NUM_PLACES_SHOW_MORE);
    });
  }

  /** ウィジェットの検索入力を初期化する */
  function initializeSearchInput() {
    const searchInputEl = widgetEl.querySelector('.place-search-input');
    widget.placeIdsToAutocompleteResults = new Map();

    // 検索入力でオートコンプリートを設定する
    const autocomplete = new google.maps.places.Autocomplete(searchInputEl, {
      types: ['establishment'],
      fields: [
        'place_id', 'name', 'types', 'geometry.location', 'formatted_address', 'photo', 'url', 'website', 'formatted_phone_number', 'opening_hours',
      ],
      bounds: widget.mapBounds,
      strictBounds: true,
    });
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      widget.placeIdsToAutocompleteResults.set(place.place_id, place);
      widget.selectPlaceById(place.place_id, /* panToMarker= */ true);
      searchInputEl.value = '';
    });
  }
}

// 緯度経度から場所に移動する
function geocodeLatLng(geocoder, map) {
  // 最初に入っている緯度経度を識別する
  let input = document.getElementById("latlng").value;
  const latlngStr = input.split(",", 2);
  const latlng = {
    lat: parseFloat(latlngStr[0]),
    lng: parseFloat(latlngStr[1]),
  };
  console.log(latlng)
  geocoder
    .geocode({ location: latlng })
    .then((response) => {
      if (response.results[0]) {
        map.setZoom(5);
        map.setCenter(latlng);
        // 応急措置で位置情報をスタート地点にする
        if (latlng.lat !== 35.6761919 && latlng.lat !== 139.6503106) {
          infoWindow.setPosition(latlng);
          infoWindow.setContent('ここからスタート！！');
        }
      } else {
        window.alert("指定の場所に移動できませんでした");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}

// ボタンがクリックされたらserchTypeと文字を変更する
function changeSearchType(type) {
  searchType = type;
  if (type === 'country') {
    message = "国";
  } else if (type === 'prefecture') {
    message = "県";
  } else if (type === 'city') {
    message = "市区町村";
  }
  document.getElementById('searchTypeText').innerHTML = message;
}

// ボタンがクリックされたらズーム状態を変更する
function changeZoomType(zoomType) {
  if (zoomType === 'countryZoom') {
    zoom = 5;
  } else if (zoomType === 'prefectureZoom') {
    zoom = 10;
  } else if (zoomType === 'cityZoom') {
    zoom = 15;
  }
  // マップのズームを変更する
  changeZoom.setZoom(zoom);
}

// 場所をクリックすると調べるフォームに飛ぶ
function clickNoArea(latlng, geocoder) {
  geocoder.geocode({ 'location': latlng }, function(results) {
    let clickAddress;
      if (results[0]) {
        // 取得した住所をフォームのinputにセットする
        let addressComponents = results[0].address_components;
        for (let i = 0; i < addressComponents.length; i++) {
          let types = addressComponents[i].types;
          // 国単位で調べたい場合
          if (searchType === 'country' && types.includes('country')) {
            // 取得した住所から国の部分だけ抽出する
            clickAddress = addressComponents[i].long_name;
            break;
          } // 県単位で調べたい場合
          else if (searchType === 'prefecture' && types.includes('administrative_area_level_1')) {
            // 取得した住所から県の部分だけ抽出する
            clickAddress = addressComponents[i].long_name;
            break;
          } // 市区町村単位で調べたい場合
          else if (searchType === 'city' && (types.includes('locality') || types.includes('administrative_area_level_2'))) {
            // 取得した住所から市区町村の部分だけ抽出する
            clickAddress = addressComponents[i].long_name;
            break;
          }
        }
        // 取得した住所をformのinputにセットする
        document.querySelector('input[name="region"]').value = clickAddress;
      }
  })
}

// 位置情報の取得でエラーが出た場合
function handleLocationError(browserHasGeolocation, infoWindow) {
  // デフォルトの設定を東京にする
  const centerLatLng = {lat: 35.681236, lng: 139.767125};
  // インフォウインドウを設置する
  infoWindow.setPosition(centerLatLng);
  infoWindow.setContent(browserHasGeolocation ?
  '地理位置情報許可が拒否されました。' :
  'お使いのブラウザは位置情報をサポートしていません。');
}