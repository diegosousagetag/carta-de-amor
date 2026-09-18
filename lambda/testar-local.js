const { handler } = require('./index');

function montarEvento(request) {
  return {
    version: '1.0',
    session: {
      new: true,
      sessionId: 'amzn1.echo-api.session.teste',
      application: { applicationId: 'amzn1.ask.skill.teste' },
      user: { userId: 'amzn1.ask.account.teste' }
    },
    context: {
      System: {
        application: { applicationId: 'amzn1.ask.skill.teste' },
        user: { userId: 'amzn1.ask.account.teste' },
        device: { deviceId: 'device-teste', supportedInterfaces: {} },
        apiEndpoint: 'https://api.amazonalexa.com'
      }
    },
    request
  };
}

const eventoAbrirSkill = montarEvento({
  type: 'LaunchRequest',
  requestId: 'amzn1.echo-api.request.1',
  timestamp: new Date().toISOString(),
  locale: 'pt-BR'
});

const eventoRespostaDia = montarEvento({
  type: 'IntentRequest',
  requestId: 'amzn1.echo-api.request.2',
  timestamp: new Date().toISOString(),
  locale: 'pt-BR',
  intent: {
    name: 'RespostaDiaIntent',
    confirmationStatus: 'NONE',
    slots: {
      resposta: { name: 'resposta', value: 'foi corrido, muita coisa pra resolver', confirmationStatus: 'NONE' }
    }
  }
});

async function testar(nome, event) {
  console.log(`\n=== ${nome} ===`);
  const resposta = await new Promise((resolve, reject) => {
    const talvezPromise = handler(event, {}, (err, res) => {
      if (err) reject(err); else resolve(res);
    });
    if (talvezPromise && typeof talvezPromise.then === 'function') {
      talvezPromise.then(resolve).catch(reject);
    }
  });
  console.log('Alexa diz:', resposta.response.outputSpeech.ssml || resposta.response.outputSpeech.text);
}

(async () => {
  await testar('LaunchRequest (abrir a skill)', eventoAbrirSkill);
  await testar('RespostaDiaIntent (ela responde algo)', eventoRespostaDia);
})().catch(e => console.error('Erro:', e));
