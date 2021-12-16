import { ajax } from "rxjs/ajax";
import { map, catchError, filter } from "rxjs/operators";
import { of } from "rxjs";
import jsonTest from "../test.json";


class App {
  constructor() {
    this.messages = document.querySelector(".messages");
    this.init();
  }

  init() {
    this.getMesseges();
    setInterval(() => this.getNewMesseges(), 3000);
  }

  getMesseges() {
    ajax
      .getJSON(`https://rxjs-dz.herokuapp.com/new_messages/unread`)
      .pipe(
        map((userResponse) => this.arrToElement(userResponse)),
        catchError((error) => {
          console.log("error: ", error);
          return of(error);
        })
      )
      .subscribe();
  }

  getNewMesseges() {
    ajax
      .getJSON(`http://localhost:7070/new_messages/unread`)
      .pipe(
        filter((userResponse) => userResponse.status === 200),
        map((userResponse) => this.arrToElement(userResponse)),
        catchError((error) => {
          console.log("error: ", error);
          return of(error);
        })
      )
      .subscribe();
  }

  test() {
    this.arrToElement(jsonTest);
  }

  arrToElement(obj) {
    const messeges = obj.messages;
    messeges.forEach((element) => this.addMessege(element));
  }

  addMessege(elem) {
    this.messages.insertAdjacentHTML(
      "afterbegin",
      `<div class="messages__massage">
        <div class="massage__mail">${elem.from}</div>
        <div class="massage__text">${this.checkingMessageLength(elem.subject)}</div>
        <div class="massage__date">${this.addDate()}</div>
      </div>
      `
    );
  }

  addDate() {
    const date = new Date().toLocaleString(undefined, {
      hour: 'numeric', minute: 'numeric'
    });

    const dateYare = new Date().toLocaleString(undefined, {
      year: 'numeric', month: 'numeric', day: 'numeric',
    });
    return (date + ' ' + dateYare);
  }

  checkingMessageLength(massageText) {
    if (massageText.length >= 15) {
      const strModif = massageText.slice(0, 14);
      return (strModif + "...");
    }
    return massageText;
  }
}

new App();