// Напишите программу, создающую строку, содержащую решётку 8х8, в
// которой линии разделяются символами новой строки. На каждой позиции
// либо пробел, либо #. В результате должна получиться шахматная доска.
// # # # #
//  # # # #
// # # # #
//  # # # #
// # # # #
//  # # # #
// # # # #
//  # # # #
// Когда справитесь, сделайте размер доски переменным, чтобы можно было
// создавать доски любого размера.

var size = 8;

var board = "";

for (var y = 0; y < size; y++) {
  for (var x = 0; x < size; x++) {
    if ((x + y) % 2 == 0)
      board += " ";
    else
      board += "#";
  }
  board += "\n";
}

console.log(board);
