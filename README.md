# Intelligent Tutoring System of Piano
<img src="src/logo.png"/>
This is a National Chengchi Univercity Graduation Independent Study using MIDI.

## System Structure

### Introduction
The concept of Intelligent Tutoring Systems (ITS) originated from computer-assisted instruction (CAI) in the 1970s. The early ITS systems were designed to teach and execute specific tasks dynamically adapting to various situations. In modern times, ITS systems attempt to replicate the roles of teachers or assistants by performing automated teaching tasks such as posing questions, selecting problems, and providing feedback.

The Intelligent Tutoring System of Piano (ITSP) established this time focuses on interactive learning. In my vision, I aim for a system that is less complex than traditional ITS, foregoing the sophisticated intelligent lecturing commonly seen. Instead, it resembles a personal tutor providing training tailored to students of different difficulty levels. The courses are manually curated, while the system takes on the role of guiding students. This interactive learning involves the system assigning scores and capturing students' behaviors and feedback throughout the learning process.

### Lecture Sources
This project collected each courses form Beyer: Elementary Method for the Piano, Opus 101. If any lecture wanted added, add the file to `src` and modify the `index.html`.

### Structure

#### The Domain Model
The Domain Model serves as a specialized knowledge database for various courses tailored to the different difficulty levels required by students. It utilizes the Beyer Piano Method as the foundation for the system's professional knowledge, offering standardized error correction. Within this model, specific subsets can be categorized into courses of varying scores and difficulty levels. Additionally, musical theory and phrases, essential for instruments like the piano, can be defined within the domain.

#### The Student Model
The Student Model, akin to the original ITS, tracks students' cognitive and emotional states throughout their learning journey. Using the algorithm I've developed for Model Tracing, it examines whether students deviate from the domain (meaning they deviate from the specified subset of our instructional material). The results are then provided to the Tutoring Model for specific feedback and scoring.

#### The Tutoring Model
The Tutoring Model receives information from both the Domain and Student models, selecting the subsequent course progress and planning direction using algorithms. The system also identifies instances when students deviate from the domain and offers timely feedback to correct subsequent course schedules.

#### The User Interface Model
The User Interface Model adopts a gamified approach to make learning more engaging for students. It incorporates additional music knowledge instruction and enhances piano playing knowledge and skills through gamification techniques.

### Algorithm

#### Elo Rating Algorithm
The Elo Rating System, created by Hungarian-American physicist Arpad Elo, is a recognized method for assessing the skill levels in various competitive activities and is considered an authoritative standard for evaluating playing proficiency today. In this algorithm, courses are treated as opponents for students, each course assigned a different score (difficulty rating). When students choose their initial difficulty level, a corresponding score (student proficiency rating) is allocated. As the course progresses, scores are determined based on the accuracy of musical notes (course score). After calculating the new scores, they are reintegrated into the fitness function of the previously mentioned genetic algorithm to advance to the next generation. For example in `script.js` :

    var score = dp[n1][n2] * 100 / lock2c.length;
    var rate = 1 / (1 + Math.pow(10, (currentPoint - point2) / 400));
    currentPoint = currentPoint + rate * score * 2;

#### Longest Common Subsequence Algorithm
The Longest Common Subsequence (LCS) algorithm is used to find the longest subsequence in a collection of sequences. The Longest Common Subsequence problem is a classic computer science problem and forms the basis for data comparison programs and applications in bioinformatics. In the context of the course, this algorithm is employed in the exercises towards the end. Traditional program comparisons often define encountered musical notes based on absolute positions, but this approach can become challenging to predict in case of missteps or variations in keypresses due to other factors. To ensure a fair and objective judgment, this algorithm is chosen for basic analysis and assessment in order to match musical sequences. For example in `script.js` :

    n1 = active.length;
    n2 = lock2c.length;
    dp = new Array(); // declare the 1st dimension array
    for(var i = 0;i <= n1;i++) { // the length of 1st dimension array is i
      dp[i] = new Array(); // declare the 2nd dimension
      for(var j = 0;j <= n2;j++) // for each element (2nd dimension array) in 1st dimension array could contain j elements
        dp[i][j] = 0; // initialize
    }

    for(var i = 1;i <= n1;i++) {
      for(j = 1;j <= n2;j++) {
        if(active[i - 1] != lock2c[j - 1])
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        else
          dp[i][j] = dp[i - 1][j - 1] + 1;
      }
    }

## Run the System
Connect your Windows device to a MIDI keyboard, use Chrome Browser and enjoy!
