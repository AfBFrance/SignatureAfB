window.onload = function() {
  toggleElementDisplay('showPhone', 'phone');
  toggleElementDisplay('showPhone2', 'phone2');
  toggleElementDisplay('showImage', 'additionalImage');
  toggleElementDisplay('showHours', 'hours');

  document.getElementById('generateSignatureButton').addEventListener('click', generateSignature);
  document.getElementById('copySignatureButton').addEventListener('click', copySignatureToClipboard);
};

function toggleElementDisplay(toggleId, elementId) {
  var checkBox = document.getElementById(toggleId);
  var element = document.getElementById(elementId);
  element.style.display = checkBox.checked ? 'block' : 'none';
  checkBox.addEventListener('change', function() {
    element.style.display = this.checked ? 'block' : 'none';
  });
}

// --- Format FR -> +33, supprime espaces, conserve si déjà +33
function formatPhoneFR(raw) {
  if (!raw) return "";
  let s = raw.trim().replace(/\s+/g, "");
  s = s.replace(/[^\d+]/g, "");
  if (s.startsWith("+33")) return s;
  if (/^0\d{9}$/.test(s)) return "+33" + s.slice(1);
  if (/^\d{9,10}$/.test(s)) {
    if (s.length === 10 && s.startsWith("0")) return "+33" + s.slice(1);
    return "+33" + s;
  }
  return s; // fallback
}

function generateSignature() {
  var firstName = document.getElementById('firstName').value;
  var lastName  = document.getElementById('lastName').value;
  var position  = document.getElementById('position').value;

  var showPhone = document.getElementById('showPhone').checked;
  var phoneRaw  = showPhone ? document.getElementById('phone').value.trim() : '';
  var phoneFmt  = formatPhoneFR(phoneRaw);

  var showPhone2El = document.getElementById('showPhone2');
  var phone2El     = document.getElementById('phone2');
  var showPhone2   = showPhone2El ? showPhone2El.checked : false;
  var phone2Raw    = (showPhone2 && phone2El) ? phone2El.value.trim() : '';
  var phone2Fmt    = formatPhoneFR(phone2Raw);

  var siteSelect   = document.getElementById('siteAddress');
  var siteAddress  = siteSelect.options[siteSelect.selectedIndex].text;

  function replaceSpacesWithDashes(str){ return (str || "").replace(/\s+/g,'-'); }
  var cleanedFirstName = replaceSpacesWithDashes(firstName);
  var cleanedLastName  = replaceSpacesWithDashes(lastName);
  var email = `${cleanedFirstName.toLowerCase()}.${cleanedLastName.toLowerCase()}@afb-group.eu`;

  var showHours = document.getElementById('showHours').checked;
  var hours     = showHours ? document.getElementById('hours').value : '';

  // ====== NOUVEAU : construction “anti-coupure” des téléphones ======
  // - 0 tel : rien
  // - 1 tel : inline après l’email (avec " | ")
  // - 2 tel : le second passe à la ligne (avec <br>)
  var phonesHtml = '';
  if (phoneFmt) {
    phonesHtml += ` | <img src="images/tel.png" alt="Téléphone"> <a href="tel:${phoneFmt.replace(/\s/g,'')}" style="text-decoration:none;color:#000;white-space:nowrap;">${phoneFmt}</a>`;
  }
  if (phone2Fmt) {
    // si un premier tel existe, on force un retour ligne pour le second
    phonesHtml += `${phoneFmt ? '<br>' : ' | '}<img src="images/tel.png" alt="Téléphone"> <a href="tel:${phone2Fmt.replace(/\s/g,'')}" style="text-decoration:none;color:#000;white-space:nowrap;">${phone2Fmt}</a>`;
  }
  // ================================================================

  var signature = `
  <div class="signature-template">
    <table style="padding:5px 15px 0;max-width:550px;">
      <tr style="width:20%;">
        <td style="text-align:center;">
         <img src="images/afblogo.jpg" alt="Logo afb" style="max-width:110px;height:auto;display:block;">
        </td>
        <td>
          <p style="margin:0 0 5px 0;">
            <strong id="name">${cleanedFirstName} ${cleanedLastName}</strong> | <span id="position">${position}</span>
          </p>
          <div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;">
            <p style="margin:0;">
              <img src="images/email.png" alt="Email">
              <a href="mailto:${email}" style="text-decoration:none;color:#000;white-space:nowrap;">${email}</a>
              ${phonesHtml}
            </p>
          </div>
        </td>
      </tr>
      <tr>
        <td style="text-align:center;">
          <a href="https://www.instagram.com/afb_france/"><img src="images/Instagram.png" alt="Instagram" style="max-width:20px;"></a>
          <a href="https://www.facebook.com/Social.Green.IT.France"><img src="images/Facebook.png" alt="Facebook" style="max-width:20px;"></a>
          <a href="https://www.linkedin.com/showcase/afb-france-social-and-green-it"><img src="images/Linkedin.png" alt="LinkedIn" style="max-width:20px;"></a>
          <a href="https://www.youtube.com/channel/UCtV2II_AsZznHfQ0Qcptbsw"><img src="images/YouTube.png" alt="YouTube" style="max-width:20px;"></a>
        </td>
        <td>
          <p style="text-decoration:none;color:#000;margin:0;">
            <a href="https://www.afb-group.fr/">Notre groupe</a> |
            <a href="https://www.afbshop.fr/Filialfinder?">Nos boutiques</a> |
            <a href="https://www.afbshop.fr/">Notre boutique en ligne</a>
          </p>
        </td>
      </tr>
      <tr>
        <td colspan="2">
          <p id="siteAddress" style="margin:6px 0 0 0;">${siteAddress}</p>
          ${showHours ? `<p style="margin:2px 0 0 0;">${hours}</p>` : ``}
        </td>
      </tr>
      <tr id="additionalImageRow"></tr>
    </table>
  </div>`;

  var showImage = document.getElementById('showImage').checked;
  var imageFile = document.getElementById('additionalImage').files[0];

  if (showImage && imageFile) {
    var reader = new FileReader();
    reader.onload = function(e) {
      var additionalImageHtml = `<img src="${e.target.result}" alt="Image supplémentaire" style="max-width: 550px;">`;
      document.getElementById('preview').innerHTML = signature + additionalImageHtml;
    };
    reader.readAsDataURL(imageFile);
  } else {
    document.getElementById('preview').innerHTML = signature;
  }
}

function copySignatureToClipboard() {
  var signatureElement = document.getElementById('preview');
  var range = document.createRange();
  range.selectNode(signatureElement);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  try {
    var successful = document.execCommand('copy');
    alert(successful ? 'Signature copiée dans le presse-papiers' : 'Copie échouée');
  } catch (err) {
    console.error('Erreur lors de la copie', err);
  }
  window.getSelection().removeAllRanges();
}
