module.exports = function(records){
  if(records % 10000 === 0) {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write((records/1000000).toFixed(2) + ' million records')
  }
}