$(document).ready(function(){
  
    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);
    
  })
  
  

    
    var trivia = {

    // trivia properties
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 10,
    timerOn: false,
    timerId : '',
    
    

    //questions choices and answers
    questions: {
        q1: 'Who is the lead singer of the band Bad Wolves?',
        q2: 'How much money did Bad Wolves donate to the children of Dolores ORiodorans?',
        q3: 'What is the name of the song Bad Wolves did a cover of from the band The Cranberries?',
        q4: 'What is the name of the album Bad Wolves released in 2018?',
        q5: 'Who manages the band Bad Wolves?',
        q6: 'What female vocalist is featured in Bad Wolves Hear me now?',
        q7: 'Who is the rythym guitarist for the band Bad Wolves?',
        q8: 'Who is the drummer for the band Bad Wolves?',
        q9: 'Who is the lead guitarist for the band Bad Wolves?',
        q10: 'Who is the bassist for the band Bad Wolves?'
    },
    options: {
        q1: ['Ivan Moody', 'Jonathan Davis', 'Benjamin Burnley', 'Tommy Vext'],
        q2: ['20,00', '250,000', '100,000', '475,000'],
        q3: ['Zombie', 'Sham Pain', 'Learn to Live', 'Officer Down'],
        q4: ['When Legends Rise', 'Disobey', 'Pop Evil', 'Thread'],
        q5: ['Bird man', 'Richard Cole', 'Doc McGhee', 'Zoltan Bathory'],
        q6: ['Diamante', 'P!nk', 'Amy Lee', 'Hayley Williams'],
        q7: ['Brian Welch', 'Sully Erna', 'Chris Cain', 'Jim Rooy'],
        q8: ['Ray Luzier', 'John Boecklin', 'Connor Denis', 'James Cassells'],
        q9: ['Doc Coyle', 'Ben Bruce', 'Nick Fuelling', 'Dave Grahs'],
        q10: ['Reginald Arvizu', 'Kyle Konkiel', 'Mark Klepaski', 'John Moyer']
    },
    answers: {
        q1: 'Tommy Vext',
        q2: '250,000',
        q3: 'Zombie',
        q4: 'Disobey',
        q5: 'Zoltan Bathroy',
        q6: 'Diamante',
        q7: 'Chris Cain',
        q8: 'John Boecklin',
        q9: 'Doc Coyle',
        q10: 'Kyle Konkiel'
    },
    //trivia methods
    //start game

    // method to start game
    startGame: function(){
        // restarting game results
        trivia.currentSet = 0;
        trivia.correct = 0;
        trivia.incorrect = 0;
        trivia.unanswered = 0;
        clearInterval(trivia.timerId);
        
    
        // show game section
        $('#game').show();
        
        //  empty last results
        $('#results').html('');
        
        // show timer
        $('#timer').text(trivia.timer);
        
        // remove start button
        $('#start').hide();
    
        $('#remaining-time').show();
        
        // ask first question
        trivia.nextQuestion();
        
      },
      // method to loop through and display questions and options 
      nextQuestion : function(){
        
        // set timer to 10 seconds 
        trivia.timer = 10;
         $('#timer').removeClass('last-seconds');
        $('#timer').text(trivia.timer);
        
        // to prevent timer speed up
        if(!trivia.timerOn){
          trivia.timerId = setInterval(trivia.timerRunning, 1000);
        }
        
        // gets all the questions then indexes the current questions
        var questionContent = Object.values(trivia.questions)[trivia.currentSet];
        $('#question').text(questionContent);
        
        // an array of all the user options for the current question
        var questionOptions = Object.values(trivia.options)[trivia.currentSet];
        
        // creates all the trivia guess options in the html
        $.each(questionOptions, function(index, key){
          $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
        })
        
      },
      //  decrement counter and count unanswered if timer runs out
      timerRunning : function(){
        // still has time left and there are  questions left
        if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
          $('#timer').text(trivia.timer);
          trivia.timer--;
            if(trivia.timer === 4){
              $('#timer').addClass('last-seconds');
            }
        }
        //  unanswered, run result
        else if(trivia.timer === -1){
          trivia.unanswered++;
          trivia.result = false;
          clearInterval(trivia.timerId);
          resultId = setTimeout(trivia.guessResult, 1000);
          $('#results').html('<h3>Times Up! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
        }
        //  show results
        else if(trivia.currentSet === Object.keys(trivia.questions).length){
          
          // adds results of game (correct, incorrect, unanswered) 
          $('#results')
            .html('<h3>Thank you for moshing!</h3>'+
            '<p>Correct: '+ trivia.correct +'</p>'+
            '<p>Incorrect: '+ trivia.incorrect +'</p>'+
            '<p>Unanswered: '+ trivia.unanswered +'</p>'+
            '<p>Please mosh again!</p>');
          
          // hide game sction
          $('#game').hide();
          
          // show start button
          $('#start').show();
        }
        
      },
      // evaluate the option clicked
      guessChecker : function() {
        
        // timer ID for gameResult setTimeout
        var resultId;
        
        // the answer to the current question being asked
        var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
        
        // option picked matches the answer of the question, increment correct
        if($(this).text() === currentAnswer){
          // turn button green for correct
          $(this).addClass('btn-success').removeClass('btn-info');
          
          trivia.correct++;
          clearInterval(trivia.timerId);
          resultId = setTimeout(trivia.guessResult, 1000);
          $('#results').html('<h3>Rock On!</h3>');
        }
        //  wrong option, increment incorrect
        else{
          // turn button clicked red for incorrect
          $(this).addClass('btn-danger').removeClass('btn-info');
          
          trivia.incorrect++;
          clearInterval(trivia.timerId);
          resultId = setTimeout(trivia.guessResult, 1000);
          $('#results').html('<h3>WRONG! ' + currentAnswer +'</h3>');
        }
        
      },
      //  remove previous question results and options
      guessResult : function(){
        
        // increment to next question set
        trivia.currentSet++;
        
        // remove the options and results
        $('.option').remove();
        $('#results h3').remove();
        
        // begin next question
        trivia.nextQuestion();
         
      }
    
    }
   