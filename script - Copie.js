window.onload = function() {
    toggleElementDisplay('showPhone', 'phone');
    toggleElementDisplay('showImage', 'additionalImage');
    toggleElementDisplay('showHours', 'hours');
    var selectedSite = document.getElementById('siteAddress').value;
    if (selectedSite && shopHoursMapping[selectedSite]) {
        document.getElementById('hours').value = shopHoursMapping[selectedSite];
    }
    document.getElementById('generateSignatureButton').addEventListener('click', generateSignature);
    document.getElementById('copySignatureButton').addEventListener('click', copySignatureToClipboard);
}

function toggleElementDisplay(toggleId, elementId) {
    var checkBox = document.getElementById(toggleId);
    var element = document.getElementById(elementId);
    element.style.display = checkBox.checked ? 'block' : 'none';

    checkBox.addEventListener('change', function() {
        element.style.display = this.checked ? 'block' : 'none';
    });
}
function formatPhoneFR(raw) {
  if (!raw) return "";
  let s = raw.trim().replace(/\s+/g, "");     // supprime les espaces
  s = s.replace(/[^\d+]/g, "");               // garde chiffres et +
  // Si déjà au format international
  if (s.startsWith("+33")) return s;

  // Si commence par 0 (ex. 06...), on passe en +33
  if (/^0\d{9}$/.test(s)) {
    return "+33" + s.slice(1);
  }

  // Si 9-10 chiffres sans + (on tente quand même)
  if (/^\d{9,10}$/.test(s)) {
    if (s.length === 10 && s.startsWith("0")) return "+33" + s.slice(1);
    return "+33" + s; // fallback
  }

  return s;
}

function generateSignature() {
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var position = document.getElementById('position').value;
	const showPhone = document.getElementById('showPhone').checked;
  	const phoneRaw = showPhone ? document.getElementById('phone').value.trim() : "";
  	const phoneFmt = formatPhoneFR(phoneRaw);   // => "" si vide, sinon +33...
    var siteSelect = document.getElementById('siteAddress');
    var siteAddress = siteSelect.options[siteSelect.selectedIndex].text;
    var email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@afb-group.eu`;
    

    var shopHoursMapping = {
    "Annecy": "Annecy : LUNDI AU VENDREDI...",
    "Grenoble": "Grenoble : LUNDI AU VENDREDI...",
    // Ajoutez des entrées pour chaque site
    };
	
    var showHours = document.getElementById('showHours').checked;
    var siteHours = document.getElementById('hours');
    /*var selectedShopHours = document.getElementById('hours').options[document.getElementById('hours').selectedIndex].text;*/
    /*var hours= siteHours.options[siteHours.selectedIndex].text;*/
    var hours= showHours ? document.getElementById('hours').value : '';

    var logoSrc = 'images/afb.png';
    var signature = `
    <div class="signature-template">
    <!--<table style="border: 1px solid #005191;border-radius:10px;padding:5px 15px 0px;max-width:550px;background:#F2F6FA;">-->
    <table style="padding:5px 15px 0px;max-width:550px;">
        <tr style="width:20%;">
            <td style="text-align:center;">
		<img src="images/afb.png" alt="Logo AfB" style="width:100px;">
	</td>
            <td><p style="padding 0 0 5px;"><strong id="name">${firstName} ${lastName}</strong> | <id="position">${position}
            <div style:="display: flex;flex-direction:row;flex-wrap: nowrap;justify-content: flex-start;align-items: center;align-content: stretch;"><p><img src="images/email.png" alt="Email :"> <a href="mailto:${email}">${email}</a>
		${showPhone ? ` | <img src="images/tel.png" alt="Tel :"> <a href="tel:${phone}">${phone}</a></p>` : ''}
                            </div></td>
        </tr>
        <tr>
	    <td style="text-align:center;">
		   <a href="https://www.instagram.com/afb_france/"><img src="./images/Instagram.png" alt="Instagram" style="max-width: 20px;"></a> 
                    <a href="https://www.facebook.com/Social.Green.IT.France"><img src="./images/Facebook.png" alt="Facebook" style="max-width: 20px;"></a> 
                    <a href="https://www.linkedin.com/showcase/afb-france-social-and-green-it"><img src="./images/Linkedin.png" alt="LinkedIn" style="max-width: 20px;"></a> 
                    <a href="https://www.youtube.com/channel/UCtV2II_AsZznHfQ0Qcptbsw"><img src="./images/YouTube.png" alt="YouTube" style="max-width: 20px;"></a></td>
	                <td>
                <p style="text-decoration:none;color:#000;">
                    <a href="https://www.afb-group.fr/">Notre groupe</a> |
                    <a href="https://www.afbshop.fr/Filialfinder?">Nos boutiques</a> |
                    <a href="https://www.afbshop.fr/">Notre boutique en ligne</a>
                    
                </p>
            </td>
        </tr>
	<tr><td colspan="2">
	<img src="./images/barre.jpg">
	<p id="siteAddress">${siteAddress}</p>
	${showHours ? `<p>${hours}</p>` : ''}
	</td>
	</tr>
        <!-- L'emplacement pour l'image supplémentaire si ajoutée -->
        <tr id="additionalImageRow">
            <!-- L'image supplémentaire sera insérée ici si elle est ajoutée -->
        </tr>
    </table>
</div>
    `;

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
    window.getSelection().addRange(range);

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'Copie réussie' : 'Copie échouée';
        console.log(msg);
        alert('Signature copiée dans le presse-papiers');
    } catch (err) {
        console.error('Erreur lors de la copie', err);
    }

    window.getSelection().removeAllRanges();
}
