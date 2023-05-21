#  Состояние отображения (UI State)

В этой практике нужно реализовать элемент интерфейса [Collapse](https://getbootstrap.com/docs/4.5/components/collapse/#example).

## Задание

Реализуйте и экспортируйте функцию по умолчанию, которая принимает на вход список компаний (пример списка в файле `src/index.js`) и использует этот список для формирования кнопок (по одной на каждую компанию). Нажатие на кнопку приводит к выводу описания компании (если есть описание другой компании, оно заменяется). Повторное нажатие удаляет вывод. Данные должны полностью удаляться, скрытие с помощью классов не подходит. По умолчанию не показывается никакое описание.

Пример начального вывода (может отличаться от вашего):

```html
<div class="container m-3">
  <button class="btn btn-primary">
    Otus
  </button>
  <button class="btn btn-primary">
    Yandex
  </button>
  <button class="btn btn-primary">
    VK
  </button>
</div>
```

После клика на второй кнопке добавляется описание:

```html
<div class="container m-3">
  <button class="btn btn-primary">
    Otus
  </button>
  <button class="btn btn-primary">
    Yandex
  </button>
  <button class="btn btn-primary">
    VK
  </button>
  <div>search engine</div>
</div>
```

После клика на третьей кнопке описание заменяется на новое:

```html
<div class="container m-3">
  <button class="btn btn-primary">
    Otus
  </button>
  <button class="btn btn-primary">
    Yandex
  </button>
  <button class="btn btn-primary">
    VK
  </button>
  <div>social network</div>
</div>
```

После повторного клика на третьей кнопке описание удаляется:

```html
<div class="container m-3">
  <button class="btn btn-primary">
    Otus
  </button>
  <button class="btn btn-primary">
    Yandex
  </button>
  <button class="btn btn-primary">
    VK
  </button>
</div>
```