/*
  Searches matrix and fills empty cells with zeros
*/
function zeroFunc()
{
  $('input[id="values1"]').each(function(index, item) {
    if($(item).val() == "")
    {
      $(item).val(0);
    }
  });
}

/*
  Clears all cells in the matrix
*/
function clearFunc()
{
  $('input[id="values1"]').each(function(index, item) {
      $(item).val(' ');
  });
}

/*
  Removes specifed row and column, and returns array
  Used for finding the determinant at a specific index
  Parameter- matrix, row index to remove and column index to remove
  Return- An array without the row and column given
*/
function detRemove(a, rowIndex, columnIndex)
{
  var temp = [];
  var temp2 = [];

  for(var i =0; i < a.length; i++)
  {
    if (i != rowIndex)
    {
      for(var j = 0; j < a[0].length; j++)
      {
        if(j != columnIndex)
        {
            temp2.push(a[i][j]);
        }
      }
      temp.push(temp2);
      temp2 = [];
    }
  }

  return temp;
}

/*
  Recursive function to calculate the determinant
  Parameter- nxn matrix
  Return- value for the determinant
*/
function detRec(a)
{
    if (a.length==2)
    {
      return (a[0][0]*a[1][1])-(a[0][1]*a[1][0]);
    }
    var answer = 0;
    for (var i=0; i< a.length; i++)
    {
        answer += Math.pow(-1,i)*a[0][i]*detRec(detRemove(a, 0, i));
    }
    return answer;
}

/*
  Transposes a matrix
  Parameter- nxn matrix
  Return- transposed array
*/
function transpose(a)
{
  var temp = [];
  var temp2 = [];

  for (var j = 0; j < a[0].length; j++)
  {
    for (var i = 0; i < a.length; i++)
    {
        temp2.push(a[i][j]);
    }
    temp.push(temp2);
    temp2 = [];
  }
  return temp;
}

/*
  Reduces a fraction to its lowest terms
  Parameter- numerator and denomerator
  Return- reduced fraction
*/
function reduceFraction(numer, denom)
{

  var g = gcd(numer, denom);
  numer /= g;
  denom /= g;

  if(denom < 0)
  {
    numer *= -1;
    denom *= -1;
  }

  if(denom == 1)
  {
    return numer;
  }

  return numer+ "/" +denom;
}

/*
  Takes a denominator and numerator of a fraction and find the greatest common divisor
  Parameter- numerator and denominator
  Return- greatest common divisor
*/
function gcd(a, b)
{
  if(!b)
  {
    return a;
  }

  return gcd(b, a%b);
}

function isFloat(num)
{
  return num % 1 !== 0;
}

function toInt(num)
{
  var n = 1;
  while(isFloat(num*n))
  {
    n *= 10;
  }

  return n;
}
