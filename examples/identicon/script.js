const origin = 'https://mountainous-dentist.glitch.me/package.json';
const pluginOrigin = `wallet_plugin_${origin}`;

const connectButton = document.querySelector('button.connect');

const setBlockieButton = document.querySelector('button.setBlockie');

connectButton.addEventListener('click', connect);

setBlockieButton.addEventListener('click', setBlockie);

<<<<<<< HEAD


async function connect () {
    await ethereum.request({
=======
async function connect() {
  await ethereum.send({
>>>>>>> add eslint and fixed related errors
    method: 'wallet_requestPermissions',
    params: [{
      [pluginOrigin]: {},
    }],
  });
}

async function setBlockie() {
  const val = document.querySelector('input[name="identicon"]:checked').value;

<<<<<<< HEAD
    try {
    const response = await ethereum.request({
        method: pluginOrigin,
        params: [{
=======
  try {
    const response = await ethereum.send({
      method: pluginOrigin,
      params: [{
>>>>>>> add eslint and fixed related errors
        method: 'setUseBlockie',
        params: [JSON.parse(val)],
      }],
    });

    alert(`couldnt change it ${response.result}`);
  } catch (err) {
    console.error(err);
    console.log(`houston we have a problem: ${err.message}` || err);
  }
}
