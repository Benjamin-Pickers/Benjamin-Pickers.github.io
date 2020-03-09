window.onload = function()
{
  //Sets the numbers for row and col selector
  $('select').each(function()
  {
    var ids = this.id;
    for(var j=2; j<=6; j++)
      {
        $(this).append('<option> '+j+' </option>');
      }
  });
  $('#createButton').on('click', createMatrix);
}

$('#answerModal').on('hidden.bs.modal', function (e) {
  $('#answerMatrix').remove();
})


/*
  Create the matrix table and buttons
*/
function createMatrix()
{
  //clear both matrices and the button, to advoid duplicates
  $('#matrix1').remove();
  $('#calcButton').remove();
  $('#addZero').remove();
  $('#clearCells').remove();

  $('#matrices').append('<table id="matrix1" class="styleMatrix"> </table>');

  //grabs the number from the select elements for the dimensions of matrix respectively
  var row1= $('#row1').val();
  var col1= row1;

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


  $('#calcDiv').append('<button id="calcButton"> Calculate the Inverse </button>');
  $('#calcDiv').append('<button id="addZero"> Fill Empty Cells </button>');
  $('#calcDiv').append('<button id="clearCells"> Clear all Cells </button>');

  $('#addZero').on('click', zeroFunc);
  $('#clearCells').on('click', clearFunc);

  //when the calculate button is clicked it creates a modal window with the answers
  $('#calcButton').on('click', function()
  {
    var validate = calcInverse(col1);

    if(validate)
    {
      $('#answer').css('visibility', 'visible');
      $('#answerModal').modal('show');
    }
  });

}

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
  Function for Calculate buttons
  Calculates the inverse of the matrix and appends it to the answer Modal
  Parameter- number of columns of the matrix
  Return- true if all inputs are valid, false otherwise
*/
function calcInverse(col1)
{

  //grabs values of the matrix and stores it in an array
  var array1 = [];
  $('input[id="values1"]').each(function(index, item) {
    array1[index] = $(item).val();
  });

  //test to see if arrays hold any non-digit characters
  //validate will be true if it does contain illegal characters
  var regex= /^[-]?[\d]+$/;
  var multiplicationValid =false;
  var validate1= array1.every( function(e){

    return regex.test(e);
  });

  //if both arrays have no non-digit characters then proceed
  if(validate1)
  {
    //create two new arrays that have each element as an array of the corresponding rows values
    //do this by splicing the arrays according to their column size and then pushing that value onto a new array
    var a =[];
    while (array1.length > 0)
    {
      a.push(array1.splice(0, col1));
    }

    var ans;

    if (a.length == 2)
    {
      ans = inverse2(a);
    }
    else
    {
      ans = inverse(a);
    }


    // detValid returns true so that we know to create the modal
    detValid=true;

    $('.modal-body').append('<div id="answer" class="d-flex justify-content-center align-items-center"> </div>');
    $('#answer').append('<p id="answerMatrix"> </p>');

    if( ans == 0)
    {
      $('#answerMatrix').append('<p> This matrix has no inverse </p>');
    }
    else
    {
      for(var i=0; i < ans.length; i++)
      {
        $('#answerMatrix').append('<tr> </tr>');

        for(var j=0; j < ans[0].length; j++)
        {
          var value = ans[i][j];
          $("#answerMatrix").append('<td class="answerCell">'+value+'</td>');
        }
      }//closes for loop
    }
  }
  else
  {
    $('#errorMsg').modal('show');
  }

 return  detValid;
}


/*
  Calculate Inverse of nxn matrix, where n>2
  Parameter- nxn matrix
  Return- Inverted matrix if it can be, otherwise return 0
*/
function inverse(a)
{
  var inv = [];
  var temp2 = [];
  var coeff = detRec(a);

  //Check if the matrix even has an inverse (determinant != 0)
  if(coeff == 0)
  {
    return 0;
  }
  else
  {
    coeff = 1/coeff;
  }

  //Get the cofactor matrix
  for (var i =0; i < a.length; i++)
  {
    for (var j =0; j < a[0].length; j++)
    {
        //Find the determinant at each index
        var temp = detRemove(a, i, j);
        var det = detRec(temp) * Math.pow(-1, (j+i));
        temp2.push(det);
    }
    //Push row to inverse matrix
    inv.push(temp2);
    temp2 = [];
  }

  //Transpose the cofactor matrix
  inv = transpose(inv);

  //Multiply by the coeff ( or 1/det(a))
  for (var i = 0; i < inv.length; i++)
  {
    for (var j = 0; j < inv[0].length; j++)
    {
      var num = inv[i][j] * coeff;
      inv[i][j] = num.toFixed(2);
    }
  }

  return inv;
}

/*
  Calculate the inverse of a 2x2 matrix
  Parameter- 2x2 matrix
  Return- Inverted matrix if it can be, otherwise return 0
*/
function inverse2(a)
{
  var coeff = detRec(a);

  if(coeff == 0)
  {
    return 0;
  }
  else
  {
    coeff = 1 / coeff;
  }

  var inv = [ [a[1][1], -1 * a[0][1]], [-1 * a[1][0], a[0][0]] ];

  for(var i =0; i < inv.length; i++)
  {
    for(var j=0; j < inv[0].length; j++)
    {
      var num = inv[i][j] * coeff;
      inv[i][j] = num.toFixed(2);
    }
  }
  return inv;
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
