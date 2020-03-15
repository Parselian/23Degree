'use-strict';

window.addEventListener('DOMContentLoaded', () => {
  const enableMap = () => {
    const map = document.getElementById('map');
    
    ymaps.ready(init);
    function init() {
      // Создание карты.
      var myMap = new ymaps.Map(map, {
        // Координаты центра карты.
        // Порядок по умолчанию: «широта, долгота».
        // Чтобы не определять координаты центра карты вручную,
        // воспользуйтесь инструментом Определение координат.
        center: [43.23, 76.95],
        // Уровень масштабирования. Допустимые значения:
        // от 0 (весь мир) до 19.
        zoom: 15
      });

      var myGeoObject = new ymaps.GeoObject({
        geometry: {
          type: "Point", // тип геометрии - точка
          coordinates: [43.23, 76.95]
        },
        properties: {
          iconCaption: 'Алматы'
        }
      }, {
        preset: 'islands#blueCircleDotIconWithCaption',
        iconCaptionMaxWidth: '50'
      });
      myMap.geoObjects.add(myGeoObject); 

      myMap.behaviors.disable('scrollZoom');
      myMap.behaviors.disable('drag');
    }
  };
  enableMap();
});