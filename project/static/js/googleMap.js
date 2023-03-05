// google mapの機能のための処理


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
  // 境界線を使うための処理
  bounds = new google.maps.LatLngBounds();
  // マーカー間で共有する情報ウィンドウを作成する
  infoWindow = new google.maps.InfoWindow();
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
      // 境界線を設定？？？
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
      // 地図をクリックした際のイベントを追加する
      map.addListener('click', function(event) {
        // クリックされた場所の緯度経度を取得する
        let clickLatlng = event.latLng;
        // 住所を逆ジオコーディングで取得する
        let geocoder = new google.maps.Geocoder();
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

  // // 複数のピンを立てる用(ログイン機能でこのピンを増やせるように設定できたらいいですね)
  // const tourStops = [
  //   // {}内はposition、""内は土地のタイトル(label)が表示される
  //   [{ lat: 34.661678, lng: 135.139114 }, "大阪"],
  //   [{ lat: 43.4211317, lng: 140.3330675 }, "北海道"],
  //   [{ lat: 25.953396, lng: 124.8892883 }, "沖縄"],
  //   [{ lat: 35.681236, lng: 139.767125 }, "東京"],
  // ];

  // // ピンを設置する前の処理
  // tourStops.forEach(([position, title]) => {
  //   // ピンを立てる
  //   marker = new google.maps.Marker({
  //     position,
  //     map,
  //     // ピンをドラッグできるようにする(falseにしてるので動かせない)
  //     draggable: false,
  //     // アニメーションをつける
  //     animation: google.maps.Animation.DROP,
  //     // ピンにタイトルをつける(titleはピンにカーソルを近づけると表示される)
  //     title: `${title}`,
  //     label: `${title}`,
  //     label: {
  //       text: `${title}`, //ラベル文字を指定
  //       color: '#FFFFFF', //文字の色を指定
  //       fontSize: '10px' //文字のサイズを指定
  //     },
  //     // レンダリングを最適化しない(こうしないと一部が動作しない)
  //     optimized: false,
  //   });

  //   // 各ピンに移動する処理を追加し、情報ウィンドウを設定する
  //   marker.addListener("click", () => {
  //     infoWindow.close();
  //     infoWindow.setContent(marker.getTitle());
  //     infoWindow.open(marker.getMap(), marker);
  //     // ジャンプアニメーションを起動する
  //     toggleBounce();
  //   });
  // });
  // marker.setMap(map);
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
  // 地図をクリックした際のイベントを追加する
  map.addListener('click', function(event) {
    // クリックされた場所の緯度経度を取得する
    let clickLatlng = event.latLng;
    // 住所を逆ジオコーディングで取得する
    let geocoder = new google.maps.Geocoder();
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
    keyword: '大使館'
  };
  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, nearbyCallback);
}

// NearbySearch関数の結果(最大 20)を処理する
function nearbyCallback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    // createMarkers関数を呼び出す
    createMarkers(results);
  }
}

// 各場所の結果の位置にピンを設定する
function createMarkers(places) {
  places.forEach(place => {
  let marker = new google.maps.Marker({
    position: place.geometry.location,
    map: map,
    title: place.name
  });
  // 各マーカーにクリックイベントを追加
  google.maps.event.addListener(marker, 'click', () => {
    let request = {
      placeId: place.place_id,
      fields: ['name', 'formatted_address', 'geometry', 'rating', 'website', 'photos']
    };
    // ユーザーがマーカーをクリックしたときに場所の詳細を取得する。すべての場所の結果の詳細を取得したらすぐAPIの仕様上限に達してしまう
    service.getDetails(request, (placeResult, status) => {
      // showDetails関数を呼び出す
      showDetails(placeResult, marker, status)
    });
    toggleBounce(marker)
  });
  // このピンの位置を含むように地図の境界を調整します
  bounds.extend(place.geometry.location);
  });
  // すべてのマーカーを配置したら、マップの境界を「視領域内のすべてのマーカー」に表示するよう調整する
  map.fitBounds(bounds);
}

// InfoWindowを構築してマーカーの上に詳細を表示します
function showDetails(placeResult, marker, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    let placeInfoWindow = new google.maps.InfoWindow();
    // 表示の形式
    placeInfoWindow.setContent('<div><strong>' + placeResult.name + '</strong><br>' + 'Rating: ' + placeResult.rating + '</div>');
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
  // infoPaneを開く
  infoPane.classList.add("open");
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