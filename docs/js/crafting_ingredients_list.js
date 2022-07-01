'use strict';

$(async () => {
	const {ids: divs, recipes: gotRecipes} = await $.recipes.load()
	const ids = Object.keys(divs)

	for (const id of ids) {
		const recipe = gotRecipes[id]
		const ingredients = {}
		recipe.inputs.forEach(input => {
			if (Object.keys(ingredients).includes(input.item))
				ingredients[input.item] += 1
			else ingredients[input.item] = 1
		})
		console.log(id)

		let ings = $.recipes.utils.objToArr(ingredients)
		for (let i in ings) {
			const ingsArr = [].concat(ings[i])
			const count = ingsArr.pop()
			const translation = await $.recipes.lang.get(ings[i][0])
			ingsArr.push(translation, count)
			ings[i] = ingsArr
		}
		ings.sort((a, b) => {
			if (a[2] > b[2]) return -1
			if (a[2] < b[2]) return 1
			return a[1].localeCompare(b[1])
		})

		const ingsTable = document.createElement('table')
		const ingsTableCaption = ingsTable.createCaption()
		ingsTableCaption.innerHTML = await $.recipes.lang.get(recipe.outputs[0].item)

		for (const ingredient of ings) {
			const ingsRow = ingsTable.insertRow()
			
			const cellImg = ingsRow.insertCell()
			const cellName = ingsRow.insertCell()
			const cellCount = ingsRow.insertCell()

			cellName.style.padding = '5px'
			cellCount.style.padding = '5px'

			const img = document.createElement('img')
			img.src = $.recipes.utils.imagePath(ingredient[0])
			img.onerror = () => {
				cellImg.removeChild(img)
			}
			// img.alt = ingredient[1]
			cellImg.appendChild(img)

			cellName.innerHTML = ingredient[1]
			cellCount.innerHTML = ingredient[2]
		}

		divs[id].appendChild(ingsTable)
		divs[id].appendChild(document.createElement('p'))
	}
})
