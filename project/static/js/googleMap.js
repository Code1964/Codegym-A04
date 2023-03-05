// google mapの機能を表示するための処理

// initMap外に表示
let marker;
// 国単位か都道府県単位か市区町村単位かを変えるための変数
let searchType = "country";
// 現在の検索ステータスを文字で表示するための変数
let message = "国";
// マップのズームを調整するために使用
let zoom = 5;

let map;

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

// mapオブジェクト作成・初期化
function initMap() {
  // 最初の位置を設定
  let centerLatLng = new google.maps.LatLng(35.681236,139.767125);
  // マップを表示させる際の微調整
  let mapOptions = {
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

  // 複数のピンを立てる用(ログイン機能でこのピンを増やせるように設定できたらいいですね)
  const tourStops = [
    // {}内はposition、""内は土地のタイトル(label)が表示される
    [{ lat: 34.661678, lng: 135.139114 }, "大阪"],
    [{ lat: 43.4211317, lng: 140.3330675 }, "北海道"],
    [{ lat: 25.953396, lng: 124.8892883 }, "沖縄"],
    [{ lat: 35.681236, lng: 139.767125 }, "東京"],
  ];

  // マーカー間で共有する情報ウィンドウを作成する
  const infoWindow = new google.maps.InfoWindow();

  // ピンを設置する前の処理
  tourStops.forEach(([position, title]) => {
    // ピンを立てる
    marker = new google.maps.Marker({
      position,
      map,
      // ピンをドラッグできるようにする(falseにしてるので動かせない)
      draggable: false,
      // アニメーションをつける
      animation: google.maps.Animation.DROP,
      // ピンにタイトルをつける(titleはピンにカーソルを近づけると表示される)
      title: `${title}`,
      label: `${title}`,
      label: {
        text: `${title}`, //ラベル文字を指定
        color: '#FFFFFF', //文字の色を指定
        fontSize: '10px' //文字のサイズを指定
      },
      // レンダリングを最適化しない(こうしないと一部が動作しない)
      optimized: false,
    });

    // 各ピンに移動する処理を追加し、情報ウィンドウを設定する
    marker.addListener("click", () => {
      infoWindow.close();
      infoWindow.setContent(marker.getTitle());
      infoWindow.open(marker.getMap(), marker);
      // ジャンプアニメーションを起動する
      toggleBounce();
    });
  });
  marker.setMap(map);
}

// ジャンプするアニメーション
function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

window.initMap = initMap;