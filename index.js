const form = document.querySelector("#form");
const submit = document.querySelector("#enviar");
const title = document.querySelector("#question__title");
const questionNumber = document.querySelector("#question__number");
const radioAlt = document.querySelector(".radio-alt");
const btnProx = document.querySelector("#btn-prox");
const btnAnt = document.querySelector("#btn-ant");
const divActions = document.querySelector(".actions");
const divResultado = document.querySelector(".div-resultado");
let quizquizdata = null;
let btnVerificar = null;
let resultado = null;
let i = 0;

async function getQuestions() {
  try {
    const respostaQuestion = await fetch(`quiz.json`);
    const data = await respostaQuestion.json();
    quizdata = data;
    title.innerText = quizdata.quiz[i].pergunta;
    questionNumber.innerText = i + 1;
    exibiraltern(quizdata);
  } catch (error) {
    divActions.remove();
    title.innerHTML = "não foi possivel carregar as questões";
  } finally {
  }
}

getQuestions();

let alternatives = [];
const alternativasUser = [];

function exibiraltern() {
  form.innerHTML = "";
  for (let x = 0; x < quizdata.quiz[i].alternativas.length; x++) {
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.classList.add("radio");
    radio.id = `question${x}`;
    radio.name = "question";
    const label = document.createElement("label");
    label.htmlFor = `question${x}`;
    label.innerText = quizdata.quiz[i].alternativas[x];
    const questionDiv = document.createElement("div");
    questionDiv.classList.add("question-div");
    questionDiv.appendChild(radio);
    questionDiv.appendChild(label);
    form.appendChild(questionDiv);
  }
}

btnAnt.addEventListener("click", function () {
  i--;
  if (i < 0) {
    i = 0;
  }
  title.innerText = quizdata.quiz[i].pergunta;
  questionNumber.innerText = i + 1;
  exibiraltern();
  if (divActions) {
    btnVerificar = divActions.querySelector("button.btn-verifcar"); // Busca o botão, se já existir
    divActions.removeChild(btnVerificar);
  }
});

btnProx.addEventListener("click", function () {
  i++;
  if (i >= quizdata.quiz.length) {
    i = quizdata.quiz.length - 1;
  }
  title.innerText = quizdata.quiz[i].pergunta;
  questionNumber.innerText = i + 1;

  if (i >= quizdata.quiz.length - 1) {
    if (divActions) {
      btnVerificar = divActions.querySelector("button.btn-verifcar"); // Busca o botão, se já existir
      btnVerificar;

      if (!btnVerificar) {
        // Cria o botão apenas se ele não existir
        btnVerificar = document.createElement("button");
        btnVerificar.classList.add("btn-verifcar");
        btnVerificar.textContent = "Resultado";
        divActions.appendChild(btnVerificar);
      }

      // Garante que o evento `onclick` seja atribuído corretamente
      btnVerificar.onclick = sendResponses;
    }
  }

  exibiraltern();
});

submit.addEventListener("click", function () {
  alternatives = [];
  alternatives.push(...Array.from(form.elements));
  alternatives.forEach((element, index) => {
    if (element["checked"] === true) {
      if (alternativasUser[i] >= 0) {
        alternativasUser.splice(i, 1, index); // Usando 'i' aqui
      } else {
        alternativasUser.push(index);
      }
    }
  });
});

function sendResponses() {
  let acertos = 0;
  for (let j = 0; j < quizdata.quiz.length; j++) {
    if (quizdata.quiz[j].resposta_correta === alternativasUser[j]) {
      acertos++;
    }
  }

  if (resultado) {
    resultado.innerHTML = "";
  }
  resultado = document.createElement("h2");
  resultado.classList.add("resultado");
  resultado.textContent = `Resultado ${acertos}/${quizdata.quiz.length}`;
  divResultado.appendChild(resultado);
  resultado.style.fontSize = "50px";

  if (acertos > quizdata.quiz.length / 2) {
    resultado.style.color = "#10b95c"; // Mais da metade correta
  } else if (acertos === quizdata.quiz.length / 2) {
    resultado.style.color = "#f9d342"; // Amarelo suave
  } else {
    resultado.style.color = "#ef4646"; // Metade ou menos correta
  }
}
