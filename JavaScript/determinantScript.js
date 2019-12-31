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

function createMatrix()
{
  //clear both matrices and the button, to advoid duplicates
  $('#matrix1').remove();
  $('#calcButton').remove();
  $('#addZero').remove();

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


  $('#calcDiv').append('<button id="calcButton"> Find the Determinant </button>');
  $('#calcDiv').append('<button id="addZero"> Fill Empty Cells </button>');

  $('#addZero').on('click', zeroFunc);

  //when the calculate button is clicked it creates a modal window with the answers
  $('#calcButton').on('click', function()
  {
    var validate = calcDeterminant(col1);

    if(validate)
    {
      $('#answer').css('visibility', 'visible');
      $('#answerModal').modal('show');
    }
  });

}

////Searches both matrices and fills empty cells with zeros
function zeroFunc()
{
  $('input[id="values1"]').each(function(index, item) {
    if($(item).val() == "")
    {
      $(item).val(0);
    }
  });
}

function calcDeterminant(col1)
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

    var ans = detRec(a);

    // detValid returns true so that we know to create the modal
    detValid=true;

    $('.modal-body').append('<div id="answer" class="d-flex justify-content-center align-items-center"> </div>');
    $('#answer').append('<p id="answerMatrix"> </p>');
    $('#answerMatrix').html(ans);


  }
  else
  {
    $('#errorMsg').modal('show');
  }

 return  detValid;
}

//Recursive function to calculate the determinant
function detRec(M)
{
    if (M.length==2)
    {
      return (M[0][0]*M[1][1])-(M[0][1]*M[1][0]);
    }
    var answer = 0;
    for (var i=0; i< M.length; i++)
    {
        answer += Math.pow(-1,i)*M[0][i]*detRec(deleteRowAndColumn(M,i));
    }
    return answer;
}

//deletes from matrix
function deleteRowAndColumn(M,index)
{
    var temp = [];
    for (var i=0; i<M.length; i++) { temp.push(M[i].slice(0)); }
    temp.splice(0,1);
    for (var i=0; i<temp.length; i++) { temp[i].splice(index,1); }
    return temp;
}
