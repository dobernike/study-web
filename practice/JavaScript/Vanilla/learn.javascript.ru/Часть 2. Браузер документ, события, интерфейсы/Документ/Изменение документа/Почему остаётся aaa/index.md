<!-- Почему остаётся "aaa"?
важность: 1

Запустите этот пример. Почему вызов removeChild не удалил текст "aaa"?

<table id="table">
  aaa
  <tr>
    <td>Тест</td>
  </tr>
</table>

<script>
  alert(table); // таблица, как и должно быть

  table.remove();
  // почему в документе остался текст "ааа"??
</script> -->

Невалидный текст ааа, т.к. в table не может быть текста, то браузер прокидывает его выше.