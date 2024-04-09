window.onload = function() {
    toggleElementDisplay('showPhone', 'phone');
    toggleElementDisplay('showPhone2', 'phone2');
    toggleElementDisplay('showImage', 'additionalImage');
    toggleElementDisplay('showHours', 'hours');

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

function generateSignature() {
    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var position = document.getElementById('position').value;
    var showPhone = document.getElementById('showPhone').checked;
    var phone = showPhone ? document.getElementById('phone').value : '';
    var phone2 = showPhone2 ? document.getElementById('phone2').value : '';

    var siteSelect = document.getElementById('siteAddress');
    var siteAddress = siteSelect.options[siteSelect.selectedIndex].text;
    
	function replaceSpacesWithDashes(str) {
        return str.replace(/\s+/g, '-');
    }
    var cleanedFirstName = replaceSpacesWithDashes(firstName);
    var cleanedLastName = replaceSpacesWithDashes(lastName);
    var email = `${cleanedFirstName.toLowerCase()}.${cleanedLastName.toLowerCase()}@afb-group.eu`;

    var showHours = document.getElementById('showHours').checked;
    var siteHours = document.getElementById('hours');
    /*var selectedShopHours = document.getElementById('hours').options[document.getElementById('hours').selectedIndex].text;*/
    /*var hours= siteHours.options[siteHours.selectedIndex].text;*/
    var hours= showHours ? document.getElementById('hours').value : '';

    var logoSrc = 'images/afb.png';
    var signature = `
    <div class="signature-template">
    <!--<table style="border: 1px solid #005191;border-radius:10px;padding:5px 0px;max-width:550px;background:#F2F6FA;">-->
    <table style="padding:5px 15px 0px;max-width:550px;">
        <tr style="width:20%;">
            <td style="text-align:center;">
		<img src="images/afb.png" alt="Logo AfB" style="width:100px;">
	</td>
            <td><p style="padding 0 0 5px;"><strong id="name">${cleanedFirstName} ${cleanedLastName}</strong> | <id="position">${position}
            <div style:="display: flex;flex-direction:row;flex-wrap: nowrap;justify-content: flex-start;align-items: center;align-content: stretch;"><p><img src="images/email.png" alt="Email :"> <a href="mailto:${email}">${email}</a>
		${showPhone ? ` | <img src="images/tel.png" alt="Tel :"> <a href="tel:+33${phone}">+33${phone}</a></p>` : ''} ${showPhone2 ? `<img src="images/tel.png" alt="Tel :"> <a href="tel:+33${phone2}">+33${phone2}</a></p> ` : ''}
                            </div></td>
        </tr>
        <tr>
	    <td style="text-align:center;">
		   <a href="https://www.instagram.com/afb_france/"><img src="images/Instagram.png" alt="Instagram" style="max-width: 20px;"></a> 
                    <a href="https://www.facebook.com/Social.Green.IT.France"><img src="images/Facebook.png" alt="Facebook" style="max-width: 20px;"></a> 
                    <a href="https://www.linkedin.com/showcase/afb-france-social-and-green-it"><img src="images/Linkedin.png" alt="LinkedIn" style="max-width: 20px;"></a> 
                    <a href="https://www.youtube.com/channel/UCtV2II_AsZznHfQ0Qcptbsw"><img src="images/YouTube.png" alt="YouTube" style="max-width: 20px;"></a></td>
	                <td>
                <p style="text-decoration:none;color:#000;">
                    <a href="https://www.afb-group.fr/">Notre groupe</a> |
                    <a href="https://www.afbshop.fr/Filialfinder?">Nos boutiques</a> |
                    <a href="https://www.afbshop.fr/">Notre boutique en ligne</a>
                    
                </p>
            </td>
        </tr>
	<tr><td colspan="2">
	<img src="images/barre.jpg">
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
