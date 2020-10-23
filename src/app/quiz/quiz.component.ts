import { Component, OnInit } from '@angular/core';

import { QuizService } from '../services/quiz.service';
import { Option, Question, Quiz, Config } from '../models/index';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [QuizService]
})
export class QuizComponent implements OnInit {
  JSquiz: any[];
  quiz: Quiz = new Quiz(null);
  type = 'quiz';
  quizName: string;
  config: Config = {
    'allowBack': true
  };

  pager = {
    index: 0,
    size: 1,
    count: 1
  };

  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.JSquiz = this.quizService.getAll();
    this.quizName = this.JSquiz[0].id;
    this.loadQuiz(this.quizName);
  }
  
  loadQuiz(quizName: string) {
    this.quizService.get(quizName).subscribe(res => {
      this.quiz = new Quiz(res);
      this.pager.count = this.quiz.questions.length;
    });
    this.type = 'quiz';
  }

  get filteredQuestions() {
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    }
  }

  move(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.type = 'quiz';
    }
    else if (index >= 0 && index == this.pager.count) {
      alert("You can't go forward anymore");
    }
    else if (index <= 0) {
      alert("You can't go back anymore");
    }
  }

  isCorrect(question: Question) {
    return question.options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
  };

  onSubmit() {
    let answers = [];
    this.quiz.questions.forEach(x => 
      answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered })
    );
    console.log(this.quiz.questions);
    alert('You got ' + this.quiz.questions.filter(question => question.options.every(x => x.selected === x.isAnswer)).length + ' question/s right')
    this.type = 'result';
  }

  test(){
    this.type = 'quiz';
  }
}
