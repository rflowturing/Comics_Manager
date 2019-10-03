((window) => {

    //const axios = require("axios");

    function encodeImageFileAsURL(element) {
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {

            let image = reader.result;
            image = image.split(",")[1];
            document.getElementById("editImage").value = image
            document.getElementById("addImage").value = image
        }
        reader.readAsDataURL(file);
    }

    window.onload = function () {

        const api = 'https://character-database.becode.xyz'

        async function getCharacters() {
            let result = await axios.get(`${api}/characters`)
            const array = result.data

            // data indispensable pour afficher les données du tableau

            var str = '<div>'
            //Creation de div pour chaque HEROS
            array.forEach(function (element) {

                str += `<div>`

                str += '<img src="data:image/jpeg;base64,' + element.image + '"/>'
                str += '<h1>' + element.name + '</h1>';
                str += '<p>' + element.shortDescription + '</p>';
                str += `<div class="buttons"  name="${element.id}">`
                str += `<button type="button" class="viewHero"  data-toggle="modal" data-target="#view" >View</button">`
                str += `<button type="button" class="editHero" data-toggle="modal" data-target="#editModal">Edit</button">`
                str += `<button class="deleteHero">Delete</button">`
                str += '</div>'
                str += '</div>'

            });

            str += '</div>';

            document.getElementById("list").innerHTML = str;


            //viewHero renvoi un tableau

            // pour chaque bouton ViewHEro on a accès a la modal de ce hero
            document.querySelectorAll("#list .viewHero").forEach((element) => {

                element.addEventListener("click", async (e) => {

                    document.getElementById("target").innerHTML = "";
                    let id = e.target.parentElement.getAttribute("name")

                    let idHero = await axios.get(`https://character-database.becode.xyz/characters/${id}`)

                    let arrayOfHero = await idHero.data;


                    let template = document.getElementById("tpl-hero")
                    let infos = document.importNode(template, true).content;

                    infos.querySelector("h4").innerHTML = arrayOfHero.name
                    infos.querySelector("em").innerHTML = arrayOfHero.description

                    infos.querySelector("p").innerHTML = arrayOfHero.shortDescription

                    infos.querySelector("span").innerHTML = '<img src="data:image/jpeg;base64,' + arrayOfHero.image + '"/>'

                    //lui donne un enfant qui  importe infos , nbre fois de boucle,
                    //et true = si il prend les infos dedans ou pas
                    document.getElementById("target").appendChild(infos)

                })

            })


            // Bouton delete hero
            document.querySelectorAll("#list .deleteHero").forEach((element) => {

                element.addEventListener("click", async (e) => {

                    let id = e.target.parentElement.getAttribute("name")

                    let idHero = await axios.get(`https://character-database.becode.xyz/characters/${id}`)

                    let arrayOfHero = await idHero.data;

                    if (confirm('Voulez-vous supprimer?')) {
                        alert('Vous avez supprimé le héro ' + arrayOfHero.name);

                        await axios.delete(`https://character-database.becode.xyz/characters/${id}`)


                    } else {
                        alert("Vous avez sauvé votre héro ");
                    }
                    window.location.reload(true);
                })

            })

            //Add Button
            document.getElementById("sendInfo").addEventListener("click", async () => {
                let inputName = document.getElementById("addName").value
                let inputShortDescription = document.getElementById("addShortDescription").value
                let inputDescription = document.getElementById("addDescription").value
                let inputImage = document.getElementById("addImage").value
                //let dataURL = document.getElementById("addImage").toDataURL('image/jpeg', 0.5);

                if (inputName.trim() == "" || inputShortDescription.trim() == "" || inputDescription.trim() == "" || inputImage.trim() == "") {
                    alert("il manque des infos");
                } else {
                    await axios.post(`${api}/characters/`, {

                        name: inputName,
                        shortDescription: inputShortDescription,
                        description: inputDescription,
                        image: inputImage
                    })
                }
                window.location.reload(true);


            })

            //Edit Button
            document.querySelectorAll("#list .editHero").forEach((element) => {

                element.addEventListener("click", async (e) => {

                    let id = e.target.parentElement.getAttribute("name")

                    let idHero = await axios.get(`https://character-database.becode.xyz/characters/${id}`)

                    let arrayOfHero = await idHero.data;

                    let editName = document.getElementById("editName")
                    console.log(editName + "gfjhfj")
                    let editShortDescription = document.getElementById("editShortDescription")
                    let editDescription = document.getElementById("editDescription")
                    let editImage = document.getElementById("editImage")

                    editName.value = arrayOfHero.name;
                    editShortDescription.value = arrayOfHero.shortDescription;
                    editDescription.value = arrayOfHero.description;
                    editImage.value = arrayOfHero.image;


                    document.getElementById("editInfo").addEventListener("click", async () => {


                        await axios.put(`${api}/characters/${id}`, {
                            name: editName.value,
                            shortDescription: editShortDescription.value,
                            description: editDescription.value,
                            image: editImage.value
                        })
                        window.location.reload(true);
                    })
                })

            })

        }

        getCharacters();

    }
    window.encodeImageFileAsURL = encodeImageFileAsURL;

})(window);