// Function to encrypt using AES
function encryptAES() {
  var plaintext = document.getElementById('aes-plaintext').value;
  var key = document.getElementById('aes-key').value;

  if (plaintext === '' || key === '') {
      alert('Please enter both plaintext and key.');
      return;
  }

  var encrypted = CryptoJS.AES.encrypt(plaintext, key).toString();
  document.getElementById('aes-encrypted').value = encrypted;
}

// Function to decrypt using AES
// function decryptAES() {
//   var ciphertext = document.getElementById('aes-ciphertext').value;
//   var key = document.getElementById('aes-key-decrypt').value;

//   if (ciphertext === '' || key === '') {
//       alert('Please enter both ciphertext and key.');
//       return;
//   }

//   var decrypted = CryptoJS.AES.decrypt(ciphertext, key);
//   var originalText = decrypted.toString(CryptoJS.enc.Utf8);
//   document.getElementById('aes-decrypted').value = originalText;
// }
function decryptAES() {
  var ciphertext = document.getElementById('aes-ciphertext').value;
  var key = document.getElementById('aes-key-decrypt').value;

  if (ciphertext === '' || key === '') {
      alert('Please enter both ciphertext and key.');
      return;
  }

  var decrypted;
  try {
      decrypted = CryptoJS.AES.decrypt(ciphertext, key);
      var originalText = decrypted.toString(CryptoJS.enc.Utf8);

      if (originalText === '') {
          throw new Error('Invalid key or corrupted ciphertext');
      }

      document.getElementById('aes-decrypted').value = originalText;
  } catch (e) {
      document.getElementById('aes-decrypted').value = '';
      alert('Decryption failed: ' + e.message);
  }
}
function caesarEncrypt() {
  var text = document.getElementById('caesar-input').value;
  var shift = parseInt(document.getElementById('shift').value);
  var result = "";

  for (var i = 0; i < text.length; i++) {
      var c = text.charCodeAt(i);

      if (c >= 65 && c <= 90) {
          result += String.fromCharCode((c - 65 + shift) % 26 + 65);  // Uppercase
      } else if (c >= 97 && c <= 122) {
          result += String.fromCharCode((c - 97 + shift) % 26 + 97);  // Lowercase
      } else {
          result += text.charAt(i);  // Non-alphabetic characters
      }
  }

  document.getElementById('caesar-output').value = result;
}

function caesarDecrypt() {
  var text = document.getElementById('caesar-input').value;
  var shift = parseInt(document.getElementById('shift').value);
  var result = "";

  for (var i = 0; i < text.length; i++) {
      var c = text.charCodeAt(i);

      if (c >= 65 && c <= 90) {
          result += String.fromCharCode((c - 65 - shift + 26) % 26 + 65);  // Uppercase
      } else if (c >= 97 && c <= 122) {
          result += String.fromCharCode((c - 97 - shift + 26) % 26 + 97);  // Lowercase
      } else {
          result += text.charAt(i);  // Non-alphabetic characters
      }
  }

  document.getElementById('caesar-output').value = result;
}
