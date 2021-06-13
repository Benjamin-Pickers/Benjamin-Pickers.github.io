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
    var $newContent = $('<tr>', {id:'r'+i});
    $('#matrix1').append($newContent);
    for(var j=1; j<=col1; j++)
    {
      id = '#r'+i
      $(id).append('<td><input type="text" id="values1" class="inputCells"></td>');
    }
  }


  $('#calcDiv').append('<button id="calcButton"> Calculate</button>');
  $('#calcDiv').append('<button id="addZero"> Fill Empty Cells </button>');
  $('#calcDiv').append('<button id="clearCells"> Clear all Cells </button>');

  $('#addZero').on('click', zeroFunc);
  $('#clearCells').on('click', clearFunc);
  $(function () {
    $('#matrix1').enableCellNavigation();
  });

  //when the calculate button is clicked it creates a modal window with the answers
  $('#calcButton').on('click', function()
  {
    var validate = gjelim(col1);

    if(validate)
    {
      $('#answer').css('visibility', 'visible');
      $('#answerModal').modal('show');
    }
  });

}

/*
  Function for Calculate buttons
  Calculates the inverse of the matrix and appends it to the answer Modal
  Parameter- number of columns of the matrix
  Return- true if all inputs are valid, false otherwise
*/
function gjelim(col1)
{

  //grabs values of the matrix and stores it in an array
  var array1 = [];
  $('input[id="values1"]').each(function(index, item) {
    array1[index] = $(item).val();
  });

  //test to see if arrays hold any non-digit characters
  //validate will be true if it does contain illegal characters
  var regex = /^-?\d+(\.?\d+)?$/;
  var inputValid =false;
  var validate1= array1.every( function(e){

    return regex.test(e)
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


    // inputValid returns true so that we know to create the modal
    inputValid=true;

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

 return  inputValid;
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
  var determinant = detRec(a);

  //Check if the matrix even has an inverse (determinant != 0)
  if(determinant == 0)
  {
    return 0;
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

  //Multiply by the 1/determinant
  for (var i = 0; i < inv.length; i++)
  {
    for (var j = 0; j < inv[0].length; j++)
    {
      var num = inv[i][j];
      var multiple = 1;
      var det = determinant;

      //Convert float to a fraction
      if(isFloat(num))
      {
        num *= 1;
        num = num.toFixed(3)
        multiple = toInt(num);
      }

      if(isFloat(det))
      {
        det = det.toFixed(3);
        multiple *= toInt(det);
      }

      num *= multiple;
      det *= multiple;

      //Reduce the fraction num/det
      inv[i][j] = reduceFraction(num, det);
    }
  }

  return inv;
}
