// google mapの機能のための処理

// 遠すぎる場合にピンをまとめるための処理

// 国単位か都道府県単位か市区町村単位かを変えるための変数
let searchType = "country";
// 現在の検索ステータスを文字で表示するための変数
let message = "国";
// マップのズームを調整するために使用
let zoom = 5;
// グローバル変数にしないと動かせない処理があるため
let map;
// ここからここまでの処理、という境界線を作るための変数(いらない？)
let bounds;
// 情報を表示するための変数
let infoWindow;
// 現在記してる情報を表示するための変数
let currentInfoWindow;
// 最初の位置を設定
let centerLatLng;
// マップを詳細に表示させる処理(ここに直接書き込むと表示されなかったので中身はなし)
let mapOptions;
// 場所のサービス情報を格納するための変数
let service;
// ピンに情報を載せる用の変数
let infoPane;

// mapオブジェクト作成・初期化
function initMap() {
  let marker;
  // 境界線を使うための処理
  bounds = new google.maps.LatLngBounds();
  // ピン間で共有する情報ウィンドウを作成する
  infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });
  // 現在の情報ウインドウ
  currentInfoWindow = infoWindow;
  // 情報を左に表示するための処理
  infoPane = document.getElementById('panel');
  // ジオロケーションを試す(位置情報取得)
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      // 取得したpositionから緯度経度を設定
      centerLatLng = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      // マップを詳細に表示
      mapOptions = {
        // 世界規模のサイズ(数字が大きいほどズームイン)
        zoom: zoom,
        // 座標を入力
        center: centerLatLng,
        // 地図のタイプ(航空写真+ラベル付き)
        mapTypeId: google.maps.MapTypeId.HYBRID,
        // 表示しているページがスクロールできる場合はcooperativeに、できない場合はgreedyになる
        gestureHandling: "auto",
        // マップ上のアイコンをクリックできる
        clickableIcons: true,
      };
      // googleマップを描画
      map = new google.maps.Map(document.getElementById("map"), mapOptions);
      //初期マーカー
      marker = new google.maps.Marker({
        map: map, position: new google.maps.LatLng(centerLatLng),
      });
      // 境界線を設定
      bounds.extend(centerLatLng);
      // インフォウインドウの表示場所
      infoWindow.setPosition(centerLatLng);
      // インフォウインドウの表示文字
      infoWindow.setContent('現在地はこちらです');
      infoWindow.open(map);
      map.setCenter(centerLatLng);
      // ユーザーの位置をPlaces Nearby Search関数に与える
      getNearbyPlaces(centerLatLng);
      // TODO: 以下、2回書いているので一つにまとめたい
      // 住所を逆ジオコーディングで取得する
      let geocoder = new google.maps.Geocoder();
      // htmlにあるinputの中身があるないかを判断する
      let input = document.getElementById("latlng").value;
      if (input !== undefined && input !== '') {
        // 地図が読み込まれたときの処理を行うコード
        google.maps.event.addListenerOnce(map, 'idle', function() {
          // ここに地図が読み込まれたときに一度だけ実行される処理を記述する
          // 検索欄に入っている位置情報を使って検索する
          geocodeLatLng(geocoder, map);
        });
      }
      // 地図をクリックした際のイベントを追加する
      map.addListener('click', function(event) {
        // クリックされた場所の緯度経度を取得する
        let clickLatlng = event.latLng;
        geocoder.geocode({ 'location': clickLatlng }, function(results, status) {
          if (status === 'OK') {
            if (results[0]) {
              // 取得した住所をフォームのinputにセットする
              let addressComponents = results[0].address_components;
              for (let i = 0; i < addressComponents.length; i++) {
                let types = addressComponents[i].types;
                // 国単位で調べたい場合
                if (searchType === 'country' && types.includes('country')) {
                  // 取得した住所から国の部分だけ抽出する
                  address = addressComponents[i].long_name;
                  break;
                } // 県単位で調べたい場合
                else if (searchType === 'prefecture' && types.includes('administrative_area_level_1')) {
                  // 取得した住所から県の部分だけ抽出する
                  address = addressComponents[i].long_name;
                  break;
                } // 市区町村単位で調べたい場合
                else if (searchType === 'city' && (types.includes('locality') || types.includes('administrative_area_level_2'))) {
                  // 取得した住所から市区町村の部分だけ抽出する
                  address = addressComponents[i].long_name;
                  break;
                }
              }
              // クリックした場所にカメラが移動する
              map.panTo(clickLatlng);
              //マーカーの更新
              marker.setMap();
              marker = new google.maps.Marker({
                map: map, position: clickLatlng
              });
              const service = new google.maps.places.PlacesService(map);
              const request = {
                location: event.latLng,
                fields: ["name", "formatted_address", "rating"],
              };
              service.nearbySearch(request, nearbyCallback);
              console.log(request)
              // InfoWindowを構築してピンの上に詳細を表示します
              let placeInfoWindow = new google.maps.InfoWindow();
              // 表示の形式
              placeInfoWindow.setContent('<div><strong>' + request.name + '</strong><br>' + '住所: ' + request.formatted_address + '</strong><br>' + 'Rating: ' + '</strong><br>' + request.rating + '</div>');
              placeInfoWindow.open(marker.map, marker);
              currentInfoWindow.close();
              currentInfoWindow = placeInfoWindow;
              showPanel(request);
              // 取得した住所をformのinputにセットする
              document.querySelector('input[name="region"]').value = address;
            }
          }
        });
      });
      // TODO: ここまで
  }, () => {
      // 位置情報を取得できなかった場合エラー処理を書く(ユーザーが拒否した場合)
      handleLocationError(true, infoWindow);
  });
  } else {
  // 位置情報を取得できなかった場合エラー処理を書く(ユーザーが拒否していない場合)
  handleLocationError(false, infoWindow);
  }
}

// 位置情報の取得でエラーが出た場合
function handleLocationError(browserHasGeolocation, infoWindow) {
  // デフォルトの設定を東京にする
  centerLatLng = {lat: 35.681236, lng: 139.767125};
  mapOptions = {
    // 世界規模のサイズ(数字が大きいほどズームイン)
    zoom: zoom,
    // 座標を入力
    center: centerLatLng,
    // 地図のタイプ(航空写真+ラベル付き)
    mapTypeId: google.maps.MapTypeId.HYBRID,
    // 表示しているページがスクロールできる場合はcooperativeに、できない場合はgreedyになる
    gestureHandling: "auto",
    // マップ上のアイコンをクリックできる
    clickableIcons: true,
  };
  // googleマップを描画
  map = new google.maps.Map(document.getElementById("map"), mapOptions);

  // インフォウインドウを設置する
  infoWindow.setPosition(centerLatLng);
  infoWindow.setContent(browserHasGeolocation ?
  '地理位置情報許可が拒否されました。' :
  'お使いのブラウザは位置情報をサポートしていません。');
  infoWindow.open(map);
  currentInfoWindow = infoWindow;
  // ユーザーの位置をPlaces Nearby Search関数に与える
  getNearbyPlaces(centerLatLng);
  // TODO: 以下、2回書いているので一つにまとめたい
  // 住所を逆ジオコーディングで取得する
  let geocoder = new google.maps.Geocoder();
  // htmlにあるinputの中身があるないかを判断する
  let input = document.getElementById("latlng").value;
  if (input !== undefined && input !== '') {
    // 地図が読み込まれたときの処理を行うコード
    google.maps.event.addListenerOnce(map, 'idle', function() {
      // ここに地図が読み込まれたときに一度だけ実行される処理を記述する
      // 検索欄に入っている位置情報を使って検索する
      geocodeLatLng(geocoder, map);
    });
  }
  // 地図をクリックした際のイベントを追加する
  map.addListener('click', function(event) {
    // クリックされた場所の緯度経度を取得する
    let clickLatlng = event.latLng;
    geocoder.geocode({ 'location': clickLatlng }, function(results, status) {
      if (status === 'OK') {
        if (results[0]) {
          // 取得した住所をフォームのinputにセットする
          let addressComponents = results[0].address_components;
          for (let i = 0; i < addressComponents.length; i++) {
            let types = addressComponents[i].types;
            // 国単位で調べたい場合
            if (searchType === 'country' && types.includes('country')) {
              // 取得した住所から国の部分だけ抽出する
              address = addressComponents[i].long_name;
              break;
            } // 県単位で調べたい場合
            else if (searchType === 'prefecture' && types.includes('administrative_area_level_1')) {
              // 取得した住所から県の部分だけ抽出する
              address = addressComponents[i].long_name;
              break;
            } // 市区町村単位で調べたい場合
            else if (searchType === 'city' && (types.includes('locality') || types.includes('administrative_area_level_2'))) {
              // 取得した住所から市区町村の部分だけ抽出する
              address = addressComponents[i].long_name;
              break;
            }
          }
          // クリックした場所にカメラが移動する
          map.panTo(clickLatlng);
          // 取得した住所をformのinputにセットする
          document.querySelector('input[name="region"]').value = address;
        }
      }
    });
  });
  // TODO: ここまで
}

// TODO: 範囲指定の箇所を正して意味のあるピン立てをする
// 範囲検索する
function getNearbyPlaces(position) {
  // 現在地の付近を取得
  let request = {
    location: position,
    rankBy: google.maps.places.RankBy.DISTANCE,
    // 営業している場所のみを返す
    openNow: false,
    keyword: 'aaaaaaaaaaaaa'
  };
  console.log(request)
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, nearbyCallback);
}

// NearbySearch関数の結果(最大 20)を処理する
function nearbyCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // createMarkers関数を呼び出す
    console.log(results)
    createMarkers(results);
  }
}

function createMarkers(places) {
  const markers = places.map((place) => {
    const marker = new google.maps.Marker({
      position: place.geometry.location,
      map: map,
      title: place.name,
    });
    google.maps.event.addListener(marker, "click", (event) => {
      let request = {
        placeId: place.place_id,
        fields: ["name", "formatted_address", "geometry", "rating", "website", "photos"],
      };
      service.getDetails(request, (placeResult, status) => {
        console.log(placeResult)
        showDetails(placeResult, marker, status);
      });
      // クリックした場所にカメラが移動する
      let clickLatlng = event.latLng;
      map.panTo(clickLatlng);
      toggleBounce(marker);
    });
    bounds.extend(place.geometry.location);
    return marker;
  });

  map.fitBounds(bounds);
}

// InfoWindowを構築してピンの上に詳細を表示します
function showDetails(placeResult, marker, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    let placeInfoWindow = new google.maps.InfoWindow();
    // 表示の形式
    placeInfoWindow.setContent('<div><strong>' + placeResult.name + '</strong><br>' + '住所: ' + placeResult.formatted_address + '</strong><br>' + 'Rating: ' + '</strong><br>' + placeResult.rating + '</div>');
    placeInfoWindow.open(marker.map, marker);
    currentInfoWindow.close();
    currentInfoWindow = placeInfoWindow;
    showPanel(placeResult);
  } else {
    console.log('表示に失敗しました: ' + status);
  }
}

// placeの詳細をサイドバーに表示
function showPanel(placeResult) {
  // infoPaneが既に開いている場合は閉じる
  if (infoPane.classList.contains("open")) {
    infoPane.classList.remove("open");
  }
  // 前に表示された詳細をクリアする
  while (infoPane.lastChild) {
    infoPane.removeChild(infoPane.lastChild);
  }
  // テキスト形式で場所の詳細を追加する
  let name = document.createElement('h1');
  name.classList.add('place');
  name.textContent = placeResult.name;
  infoPane.appendChild(name);
  if (placeResult.rating != null) {
    let rating = document.createElement('p');
    rating.classList.add('details');
    rating.textContent = `Rating: ${placeResult.rating} \u272e`;
    infoPane.appendChild(rating);
  }
  let address = document.createElement('p');
  address.classList.add('details');
  address.textContent = placeResult.formatted_address;
  infoPane.appendChild(address);
  if (placeResult.website) {
    let websitePara = document.createElement('p');
    let websiteLink = document.createElement('a');
    let websiteUrl = document.createTextNode(placeResult.website);
    websiteLink.appendChild(websiteUrl);
    websiteLink.title = placeResult.website;
    websiteLink.href = placeResult.website;
    websitePara.appendChild(websiteLink);
    infoPane.appendChild(websitePara);
  }
  // form処理を追加する
  let form = document.createElement('form');
  form.action = '/summary';
  form.method = 'GET';
  infoPane.appendChild(form);
  // POSTパラメーターようにinputタグを生成
  let reqElm = document.createElement('input');
  // nameとvalueにそれぞれPOSTしたいパラメーターを追加
  reqElm.name = 'region';
  reqElm.value = name.textContent;
  reqElm.placeholder = "入力"
  // inputを非表示にする
  // classは一つずつ入れる必要があるため
  const reqElmClasses = ["form-control", "mx-auto", "w-auto", "mb-3"];
  // buttonにクラスを追加する
  for (let i = 0; i < reqElmClasses.length; i++) {
    reqElm.classList.add(reqElmClasses[i]);
  }
  // フォームタグにinputタグを追加
  form.appendChild(reqElm);
  // 改行
  let br = document.createElement('br');
  form.appendChild(br);
  // 送信ボタンをつける
  let submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = '送信';
  // classは一つずつ入れる必要があるため
  const buttonClasses = ["shadow", "bg-purple-500", "hover:bg-purple-400", "focus:shadow-outline", "focus:outline-none", "text-white", "font-bold", "py-2", "px-4", "rounded"];
  // buttonにクラスを追加する
  for (let i = 0; i < buttonClasses.length; i++) {
    submitBtn.classList.add(buttonClasses[i]);
  }
  form.appendChild(submitBtn);
  // bodyにフォームタグを追加
  infoPane.appendChild(form);
  // infoPaneを開く
  infoPane.classList.add("open");
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
  geocoder
    .geocode({ location: latlng })
    .then((response) => {
      if (response.results[0]) {
        map.setZoom(5);
        map.setCenter(latlng);
      } else {
        window.alert("指定の場所に移動できませんでした");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}

// ジャンプするアニメーション
function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

// ボタンがクリックされたらserchTypeと文字を変更する
function changeSearchType(type) {
  searchType = type;
  if (type === "country") {
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
  if (zoomType === "country") {
    zoom = 5;
  } else if (zoomType === 'prefecture') {
    zoom = 10;
  } else if (zoomType === 'city') {
    zoom = 15;
  }
  // マップのズームを変更する
  map.setZoom(zoom);
}

window.initMap = initMap;