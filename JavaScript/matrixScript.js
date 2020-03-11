window.onload= function()
{
    //Sets the numbers for row and col selector
    $('select').each(function()
    {
      var ids = this.id;
      for(var j=1; j<=6; j++)
        {
          $(this).append('<option> '+j+' </option>');
        }
    });
    //fires whenever the column of the first matrix or row of the second matrix is changed, to ensure that
    //proper matrix multiplication can be achieved. col1==row2
    $('#col1').on('change', changeFunc);
    $('#row2').on('change', changeFunc);
    $('#createButton').on('click', createMatrix);

    $("[data-trigger]").on("click", function()
    {
      var trigger_id =  $(this).attr('data-trigger');
      $(trigger_id).toggleClass("show");
      $('body').toggleClass("offcanvas-active");
    });

    // close button
    $(".btn-close").click(function(e)
    {
      $(".navbar-collapse").removeClass("show");
      $("body").removeClass("offcanvas-active");
    });
}

$('#answerModal').on('hidden.bs.modal', function (e) {
  $('#answerMatrix').remove();
})

/*
  Ensures that col1 and row2 are the same number
*/
function changeFunc()
{
      var replace= $(this).val();
      if(replace == $('#col1').val())
      {
        $('#row2').val(replace);
      }
      else
      {
          $('#col1').val(replace);
      }
}

/*
  Creates both matrices and all the buttons
*/
function createMatrix()
{
  //clear both matrices and the button, to advoid duplicates
  $('#matrix1').remove();
  $('#matrix2').remove();
  $('#calcButton').remove();
  $('#addZero').remove();
  $('#clearCells').remove();

  $('#matrices').append('<table id="matrix1" class="styleMatrix"> </table>');
  $('#matrices').append('<table id="matrix2" class="styleMatrix"> </table>');

  //grabs the number from the select elements for the dimensions of matrix respectively
  var row1= $('#row1').val();
  var col1= $('#col1').val();
  var row2= $('#row2').val();
  var col2= $('#col2').val();

  //creates first matrix
  for(var i=1; i<=row1; i++)
  {
    var $newContent = $('<tr> </tr>');
    $('#matrix1').append($newContent);
    for(var j=1; j<=col1; j++)
    {
      $('#matrix1').append('<td><input type="number" id="values1"></td>');
    }
  }

  //creates second matrix
  for(var i=1; i<=row2; i++)
  {
    var $newContent = $('<tr> </tr>');
    $('#matrix2').append($newContent);
    for(var j=1; j<=col2; j++)
    {
      $('#matrix2').append('<td><input type="number" id="values2"></td>');
    }
  }

  $('#calcDiv').append('<button id="calcButton"> Multiply Matrices </button>');
  $('#calcDiv').append('<button id="addZero"> Fill Empty Cells </button>');
  $('#calcDiv').append('<button id="clearCells"> Clear all Cells </button>');

  $('#addZero').on('click', zeroFunc);
  $('#clearCells').on('click', clearFunc);

  //when the calculate button is clicked it creates a modal window with the answers
  $('#calcButton').on('click', function()
  {
    var validate = multiplyMatrix(row1, col1, row2, col2);

    if(validate)
    {
      $('#answer').css('visibility', 'visible');
      $('#answerModal').modal('show');
    }
  });
}

/*
  Searches both matrices and fills empty cells with zeros
*/
function zeroFunc()
{
  $('input[id="values1"]').each(function(index, item) {
    if($(item).val() == "")
    {
      $(item).val(0);
    }
  });

  $('input[id="values2"]').each(function(index, item) {
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

  $('input[id="values2"]').each(function(index, item) {
      $(item).val(' ');
  });
}

/*
  Function for computing the product
  Parameters- row and column count for both matrices
  Return- a boolean value stating whether the values were valid
*/
function multiplyMatrix(row1, col1, row2, col2)
{
  //Creates an array from the values of the first matrix
  var array1 = [];
  $('input[id="values1"]').each(function(index, item) {
    array1[index] = $(item).val();
  });

  //Creates an array from the values of the second matrix
  var array2 = [];
  $('input[id="values2"]').each(function(index, item) {
    array2[index] = $(item).val();
  });

  //test to see if arrays hold any non-digit characters
  //validate will be true if it does contain illegal characters
  var regex= /^[-]?[\d]+$/;
  var regex2 = /^[-]?[\d]+[\.]?[\d]+$/;
  var multiplicationValid =false;
  var validate1= array1.every( function(e){

    return regex.test(e) || regex2.test(e);
  });

  var validate2= array2.every( function(e){
    return regex.test(e) || regex2.test(e);
  });

  //if both arrays have no non-digit characters then proceed
  if(validate1 && validate2)
  {
    //create two new arrays that have each element as an array of the corresponding rows values
    //do this by splicing the arrays according to their column size and then pushing that value onto a new array
    var a =[];
    while (array1.length > 0)
    {
      a.push(array1.splice(0, col1));
    }

    var b =[];
    while (array2.length > 0)
    {
      b.push(array2.splice(0, col2));
    }

    //algorithim that computes the product
    var result = [];
    for (var i = 0; i < a.length; i++)
    {
       result[i] = [];
       for (var j = 0; j < b[0].length; j++)
       {
           var sum = 0;
           for (var k = 0; k < a[0].length; k++)
           {
               sum += a[i][k] * b[k][j];
           }

           if(isFloat(sum))
           {
             var denom = 1;
             var num = sum * 1;
             num = num.toFixed(3);
             var multiple = toInt(num);

             num *= multiple;
             denom *= multiple;

             sum = reduceFraction(num, denom);
           }

           result[i][j] = sum;
       }
    }

    // multiplicationValid returns true so that we know to create the modal
    multiplicationValid=true;

    $('.modal-body').append('<div id="answer" class="d-flex justify-content-center align-items-center"> </div>');
    $('#answer').append('<table id="answerMatrix"> </table>');

    //create a new table with the values of result and append it to the answer calcDiv
    for(var i=0; i < result.length; i++)
    {
      $('#answerMatrix').append('<tr> </tr>');

      for(var j=0; j <result[0].length; j++)
      {
        var value = result[i][j];
        $("#answerMatrix").append('<td class="answerCell">'+value+'</td>');
      }
    }
 }
 else
 {
   $('#errorMsg').modal('show');
 }

 return  multiplicationValid;
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
