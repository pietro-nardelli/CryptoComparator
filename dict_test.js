  /* TWITTER SENTIMENT */


text = "i'm so positive today!!positive positive"

const tokenize = text => text.toLowerCase().split(" ");

const deleteUselessChars = word => word.replace(/[^\w]/g, "");

const rateWord = word => (word in AFINN ? AFINN[word] : 0);

const sum = (x, y) => x + y;

const analyseText = text =>
  tokenize(text)
    .map(deleteUselessChars)
    .map(rateWord)
    .reduce(sum);



function get_text(){
  text_arr = []
  divs = document.getElementsByClassName("css-1dbjc4n r-38sf4c r-qklmqi")
  n= divs.length                        
  for(i=0;i<n;i++){
      text_arr[i] = divs[i].textContent.substring(40);
      if(/^.*?[0-9]$/.test(text_arr[i][0])){
          text_arr[i] =  text_arr[i].substring(1);
      }
  }
  return text_arr
}

function print_sentiment_info(){
  ar = get_text()
  n = ar.lenght
  for(i=0;i<21;i++){
    console.log(ar[i]);
    console.log(analyseText(ar[i]))}
}