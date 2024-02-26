console.log('hello world');
// Counter
let count = 0; // Set the counter with 0

function updateCount() {
  count++; // Increment count by 1
  document.getElementById("counter").innerText = count; // Update the number in the counter
}