function createCustomizerWindow(options){
    //options = JSON.parse(options)
    options = {}
    options.title = 'Редактор персонажа'
    options.close = false
    options.beforeWindowAppend = function(){
        this.windowObject.css({
            "max-height": "100vh",
            "width": "20vw",
            right: 0,
            top: 0,
            left: 'unset',
            bottom: 0,
            transform: 'none'
        })
    options.afterWindowAppend = function(){
      this.windowObject.position({
        my: "right center",
        at: "right center",
        of: "body"
      })
    }
    let container = this.windowObject.find('.container')

    container.append(`
    <style>
      .disabled-until-sex-chosen{
        display: none !important;
      }
    </style>
    <div class="stick-to-left">
      <div data-link="c-hair" class="tab disabled-until-sex-chosen" onclick="mp.trigger('switchToCamera', 'customizerFace', 500)">Волосы</div>
      <div data-link="c-clothes" class="tab disabled-until-sex-chosen" onclick="mp.trigger('switchToCamera', 'customizerClothes', 500)">Одежда</div>
      <div data-link="c-face-customization" class="tab disabled-until-sex-chosen" onclick="mp.trigger('switchToCamera', 'customizerFace', 500)">Лицо</div>
      <div data-link="c-general" class="tab active" onclick="mp.trigger('switchToCamera', 'customizerFull', 500)">Основные</div>
    </div>
    
    <script>
      $('.tab').click(function(){
        var target = $(this).data('link')
        $('.tab').removeClass('active');
        $(this).addClass('active')
        $('.customizer-section').hide()
        if(target) $('#'+target).show()
      })
    </script>

    <!-- general customization -->

    <div id="c-general" class="row customizer-section" style="max-height: 80vh; overflow-y: auto;">
        <div class="block s-12 disabled-until-sex-chosen">
          <div class="group">
            <div class="title">Управление камерой</div>
            <div class="container">
              <button onclick="mp.trigger('switchToCamera', 'customizerFace', 500)">Лицо</button>
              <button onclick="mp.trigger('switchToCamera', 'customizerFull', 500)">В полный рост</button>
            </div>
          </div>
        </div>
    
        <div class="block s-12">
          <div class="group">
            <div class="title">Пол</div>
            <div class="container">
              <div class="block s-12" style="text-align: center;">Внимание: при смене пола все изменения сбрасываются</div>
              <div class="block s-6" style="text-align: center;">
                Мужской
                <input id="check-male" type="checkbox" onchange="changeCheck(event); callGuiFunction(this, 'changeSex', 'male')">
              </div>
              <div class="block s-6" style="text-align: center;">
                Женский
                <input id="check-female" type="checkbox" onchange="changeCheck(event); callGuiFunction(this, 'changeSex', 'female')">
              </div>
              <script>
                function changeCheck(event){
                  event.preventDefault();
                  $('.disabled-until-sex-chosen').removeClass('disabled-until-sex-chosen');
                  $('#check-female, #check-male').prop('checked', false);
                  $(event.target).prop('checked', true);
                };
              </script>
            </div>
          </div>
        </div>
        <div class="block s-12 disabled-until-sex-chosen">
          <div class="group">
            <div class="title">Наследственность</div>
            <div class="container">
              <div>
                <label>
                  Мать
                  <input type="range" min="0" max="20" data-bindto="c-mother-value" value="0" step="1" oninput="callGuiFunction(this, 'changeParent', 'mother', this.value)">
                  <div id="c-mother-value" style="text-align: right;">0</div>
                </label>
              </div>
              <div>
                <label>
                  Отец
                  <input type="range" min="0" max="23" data-bindto="c-father-value" value="0" step="1" oninput="callGuiFunction(this, 'changeParent', 'father', this.value)">
                  <div id="c-father-value" style="text-align: right;">0</div>
                </label>
              </div>
              <div>
                <label>
                  Похож на отца или мать?
                  <input type="range" min="0" max="1" step="0.1" oninput="callGuiFunction(this, 'changeParent', 'mix', this.value)">
                  <span style="float: left;">Отец</span>
                  <span style="float: right">Мать</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="block s-12 disabled-until-sex-chosen">
          <div class="group">
            <div class="title">Цвет и текстура кожи</div>
            <div class="container">
              <div>
                <label>
                  Цвет кожи матери
                  <input type="range" min="0" max="20" data-bindto="c-skin-m-value" value="0" step="1" oninput="callGuiFunction(this, 'changeParent', 'motherSkin', this.value)">
                  <div id="c-skin-m-value" style="text-align: right;">0</div>
                </label>
              </div>
              <div>
                <label>
                  Цвет кожи отца
                  <input type="range" min="0" max="23" data-bindto="c-skin-f-value" value="0" step="1" oninput="callGuiFunction(this, 'changeParent', 'fatherSkin', this.value)">
                  <div id="c-skin-f-value" style="text-align: right;">0</div>
                </label>
              </div>
              <div>
                <label>
                  Цвет кожи больше похож на...
                  <input type="range" min="0" max="1" value="0.5" step="0.1" oninput="callGuiFunction(this, 'changeParent', 'skinMix', this.value)">
                  <span style="float: left;">Отец</span>
                  <span style="float: right">Мать</span>
                </label>
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- face customization section -->

    <div id="c-face-customization" class="row customizer-section" style="max-height: 80vh; overflow-y: auto; display:none;">

        <div class="block s-12">
          <div class="group">
            <div class="title">Область глаз</div>
            <div class="container">
              <div>
                <label>
                  Высота бровей
                  <input type="range" min="-1" max="1" step="0.05" id="brow-height" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
              <div>
                <label>
                  Выпирание бровей
                  <input type="range" min="-1" max="1" step="0.05" id="brow-width" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
              <div>
                <label>
                  Размер глаз
                  <input type="range" min="-1" max="1" step="0.05" id="eyes-size" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
              <div>
              <label>
                Цвет глаз
                <input type="range" min="0" max="8" step="1" value="0" id="eyes-color" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
              </label>
            </div>
            </div>
          </div>
        </div>

        <div class="block s-12">
          <div class="group">
            <div class="title">Нос</div>
            <div class="container">
              <div>
                <label>
                  Ширина носа
                  <input type="range" min="-1" max="1" step="0.05" id="nose-width" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
              <div>
                <label>
                  Высота носа
                  <input type="range" min="-1" max="1" step="0.05" id="nose-height" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
              <div>
                <label>
                  Длина носа
                  <input type="range" min="-1" max="1" step="0.05" id="nose-length" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
              <div>
                <label>
                  Носовая перегородка
                  <input type="range" min="-1" max="1" step="0.05" id="nose-septum" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
              <div>
                <label>
                  Кончик носа
                  <input type="range" min="-1" max="1" step="0.05" id="nose-tip" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
              <div>
                <label>
                  Смещение носовой перегородки
                  <input type="range" min="-1" max="1" step="0.05" id="nose-septum-shift" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="block s-12">
          <div class="group">
            <div class="title">Область скул</div>
            <div class="container">
                <div>
                    <label>
                    Высота скул
                    <input type="range" min="-1" max="1" step="0.05" id="cheekbone-height" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                    </label>
                </div>
                <div>
                    <label>
                    Ширина скул
                    <input type="range" min="-1" max="1" step="0.05" id="cheekbone-width" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                    </label>
                </div>
                <div>
                    <label>
                    Размер щек
                    <input type="range" min="-1" max="1" step="0.05" id="cheekbone-size" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                    </label>
                </div>
            </div>
          </div>
        </div>

        <div class="block s-12">
          <div class="group">
            <div class="title">Область челюсти</div>
            <div class="container">
              <div>
                <label>
                  Губы
                  <input type="range" min="-1" max="1" step="0.05" id="lips-size" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
              <div>
                <label>
                  Ширина челюсти
                  <input type="range" min="-1" max="1" step="0.05" id="jaw-width" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
              <div>
                <label>
                  Высота челюсти
                  <input type="range" min="-1" max="1" step="0.05" id="jaw-height" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
            </div>
          </div>
        </div>


        <div class="block s-12">
          <div class="group">
            <div class="title">Подбородок</div>
            <div class="container">
                <div>
                <label>
                  Длина подбородка
                  <input type="range" min="-1" max="1" step="0.05" id="chin-length" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
              <div>
                <label>
                  Выпирание подбородка
                  <input type="range" min="-1" max="1" step="0.05" id="chin-width" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
              <div>
                <label>
                  Ширина подбородка
                  <input type="range" min="-1" max="1" step="0.05" id="chin-shift" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
              <div>
                <label>
                  Форма подбородка
                  <input type="range" min="-1" max="1" step="0.05" id="chin-form" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="block s-12">
          <div class="group">
            <div class="title">Шея</div>
            <div class="container">
              <div>
                <label>
                  Ширина шеи
                  <input type="range" min="-1" max="1" step="0.05" id="neck-width" oninput="callGuiFunction(this, 'changeFace', this.id, this.value)">
                </label>
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- clothes section -->

    <div id="c-clothes" class="row customizer-section" style="max-height: 80vh; overflow-y: auto; display: none;">
        <div class="block s-12">
          <div class="group">
            <div class="title">Верхняя одежда</div>
            <div class="container">
              <select id="list-clothes-top" size="5" onchange="callGuiFunction(this, 'changeClothes', $('option:selected', this).data('cloth'))">
              </select>
            </div>
          </div>
        </div>
        <div class="block s-12">
          <div class="group">
            <div class="title">Штаны/шорты</div>
            <div class="container">
                <select id="list-clothes-legs" size="5" onchange="callGuiFunction(this, 'changeClothes', $('option:selected', this).data('cloth'))">
                </select>
            </div>
          </div>
        </div>

        <div class="block s-12">
          <div class="group">
            <div class="title">Обувь</div>
            <div class="container">
              <select id="list-clothes-boots" size="5" onchange="callGuiFunction(this, 'changeClothes', $('option:selected', this).data('cloth'))">
              </select>
            </div>
          </div>
        </div>
    </div>

    <!-- hair section -->

    <div id="c-hair" class="row customizer-section" style="max-height: 80vh; overflow-y: auto;display: none;">
        <div class="block s-12">
          <div class="group">
            <div class="title">Прическа</div>
            <div class="container">
              <div>
                <label>
                  Прическа
                  <input id="c-hair-selector" type="range" min="0" max="15" value="0" oninput="callGuiFunction(this, 'changeHair', 'head', this.value)">
                </label>
              </div>
              <div>
                <label>
                  Цвет волос
                  <input id="c-hair-selector" type="range" min="0" max="23" value="0" oninput="callGuiFunction(this, 'changeHair', 'color', this.value)">
                </label>
              </div>
            </div>
          </div>
        </div>
    </div>

      <!-- save button -->

      <div class="row">
        <div class="block s-12 disabled-until-sex-chosen">
          <button class="green" onclick="callGuiFunction(this, 'playerCreatorSave')">Сохранить</button>
        </div>
      </div>
      `)
      switchCustomizerOptionsBySex(this.windowObject, 'male')

        this.options.functions = { //this, 'itemAction', '${itemname}', 'use', ${plr[0]}
            "changeFace": function(caller, facepart, value){
                if(Number(value)==NaN) return
                if(facepart){
                    switch(facepart){
                        case 'brow-height':
                            mp.trigger('changeFace', 6, value)
                        break

                        case 'brow-width':
                            mp.trigger('changeFace', 7, value)
                        break

                        case 'eyes-size':
                            mp.trigger('changeFace', 11, value)
                        break

                        case 'eyes-color':
                            mp.trigger('changeFace', 'eyes', value)
                        break

                        case 'nose-width':
                            mp.trigger('changeFace', 0, value)
                        break

                        case 'nose-height':
                            mp.trigger('changeFace', 1, value)
                        break

                        case 'nose-length':
                            mp.trigger('changeFace', 2, value)
                        break

                        case 'nose-septum':
                            mp.trigger('changeFace', 3, value)
                        break

                        case 'nose-tip':
                            mp.trigger('changeFace', 4, value)
                        break

                        case 'nose-septum-shift':
                            mp.trigger('changeFace', 5, value)
                        break

                        case 'cheekbone-height':
                            mp.trigger('changeFace', 8, value)
                        break

                        case 'cheekbone-width':
                            mp.trigger('changeFace', 9, value)
                        break

                        case 'cheekbone-size':
                            mp.trigger('changeFace', 10, value)
                        break

                        case 'lips-size':
                            mp.trigger('changeFace', 12, value)
                        break

                        case 'jaw-width':
                            mp.trigger('changeFace', 13, value)
                        break

                        case 'jaw-height':
                            mp.trigger('changeFace', 14, value)
                        break

                        case 'chin-length':
                            mp.trigger('changeFace', 15, value)
                        break

                        case 'chin-width':
                            mp.trigger('changeFace', 16, value)
                        break

                        case 'chin-shift':
                            mp.trigger('changeFace', 17, value)
                        break

                        case 'chin-form':
                            mp.trigger('changeFace', 18, value)
                        break

                        case 'neck-width':
                            mp.trigger('changeFace', 19, value)
                        break
                    }
                }
            },
            "changeHair":function(caller, prop, value) {
                mp.trigger('changeHair', prop, value)
            },
            "changeSex": function(caller, sex){
              switchCustomizerOptionsBySex(this.windowObject, sex)
              mp.trigger('changeSex', sex)
            },
            "changeParent": function(caller, property, value){
              mp.trigger('changeParent', property, value)
            },
            "changeClothes": function(caller, clothData) {
              mp.trigger('changeClothes', JSON.stringify(clothData))
            },
            "playerCreatorSave": function(caller) {
                mp.trigger('playerCreatorSave')
                this.destroy()
            }
        }
    
      }
    ui.createGUI(options)
}

function switchCustomizerOptionsBySex(win, sex){
    //remove everything
    win.find('#list-clothes-top').html('')
    win.find('#list-clothes-legs').html('')
    win.find('#list-clothes-boots').html('')

    let array
    if(sex == 'male'){
        array = maleClothes

        $('#c-hair-selector', win).attr('max', maleHair.length-1)
    }else{
        array = femaleClothes

        $('#c-hair-selector', win).attr('max', femaleHair.length-1)
    }

    if(array){
        Object.keys(array).forEach(type => {
            let typehtml = ''
            Object.keys(array[type]).forEach(category => {
                let html = `<optgroup label="${category}">`
                array[type][category].forEach(cloth => {
                    html += `<option data-cloth="${JSON.stringify(cloth[1])}">${cloth[0]}</option>`
                })
                html+= `</optgroup>`
                typehtml += html
            })
            $(`select#list-clothes-${type}`, win).append(typehtml)
        })
    }
}

var maleHair = [0,1,2,3,4,5,7,9,10,11,12,13,14,15,16,22]
var femaleHair = [1,2,3,4,5,7,10,11,14,19]

var femaleClothes = {
    "top": {
        "Футболки с большим вырезом": [
            ["Белая футболка", [11,0,0,0]],
            ["Розовая футболка", [11,0,1,0]],
            ["Серая футболка", [11,0,2,0]],
            ["Желтая футболка", [11,0,3,0]],
            ["Светло-серая футболка", [11,0,11,0]]
        ],
        "Майки": [
            ["Красная майка", [11,4,13,4]],
            ["Серая майка", [11,4,14,4]]
        ]
    },
    "legs": {
        "Штаны": [
            ["Узкие джинсы", [4,0,0]],
            ["Узкие джинсы1", [4,0,1]],
            ["Узкие джинсы2", [4,0,2]],
            ["Джинсы", [4,1,0]],
            ["Джинсы1", [4,1,1]],
            ["Джинсы2", [4,1,2]],
            ["Спортивные штаны", [4,2,0]]
        ],
        "Шорты": [
            ["Короткие серые шорты", [4,14,0]],
            ["Короткие серые шорты", [4,14,1]],
            ["Короткие серые шорты", [4,14,2]],
            ["Короткие серые шорты", [4,14,3]],
        ]
    },
    "boots": {
        "Кеды": [
            ["Белые кеды/белая подошва", [6,1,0]],
            ["Черные кеды/белая подошва", [6,1,1]],
            ["Серые кеды/белая подошва", [6,1,2]],
        ],
        "Кроссовки": [
            ["Черные кроссовки", [6,4,0]],
            ["Белые кроссовки", [6,4,1]],
            ["Бежевые кроссовки", [6,4,2]]
        ],
        "Тапки": [
            ["Черные шлепанцы", [6,5,0]],
            ["Белые шлепанцы", [6,5,1]]
        ],
    }
}

var maleClothes = {
    "top": {
        "Футболки": [
            ["Белая футболка", [11,0,0,0]],
            ["Серая футболка", [11,0,1,0]],
            ["Черная футболка", [11,0,2,0]],
            ["Желтая футболка", [11,0,3,0]],
            ["Светло-серая футболка", [11,0,4,0]],
        ],
        "Майки": [
            ["Белая майка", [11,5,0,5]],
            ["Серая майка", [11,5,1,5]],
            ["Черная майка", [11,5,2,5]]
        ]
    },
    "legs": {
        "Штаны": [
            ["Серые джинсы", [4,1,0]],
            ["Серые джинсы", [4,1,1]],
            ["Узкие серые джинсы", [4,4,0]],
            ["Узкие серые джинсы", [4,4,1]],
            ["Спортивные штаны", [4,5,0]],
            ["Спортивные штаны", [4,5,1]],
            ["Спортивные штаны", [4,5,2]],
        ],
        "Шорты": [
            ["Черные шорты", [4,12,0]],
            ["Клетчатые шорты", [4,12,4]],
            ["Серые шорты", [4,12,5]],
        ],
    },
    "boots": {
        "Кеды": [
            ["Черные кеды/белая подошва", [6,1,0]],
            ["Белые кеды/белая подошва", [6,1,1]],
            ["Черные кеды/черная подошва", [6,1,2]],
        ],
        "Высокие кеды": [
            ["Темно-синие кеды", [6,4,0]],
            ["Черные кеды", [6,4,1]],
            ["Белые кеды", [6,4,2]],
        ],
        "Тапки": [
            ["Белые шлепанцы", [6,5,0]],
            ["Серые шлепанцы", [6,5,1]],
            ["Черные шлепанцы", [6,5,2]]
        ],
    }
}