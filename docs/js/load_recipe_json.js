'use strict';

const repo = 'John71-Off-Minecraft-Docs/CraftingEras'
const branch = 'main'

/*
const _load = async file => {
	const f = await fetch(`../../../data/${file}`)
	return await f.json()
}
*/

const _load = async file => {
	const f = await fetch(`https://raw.githubusercontent.com/${repo}/${branch}/docs/data/${file}`)
	return await f.json()
}

const _load_lang_def = async regName => {
	const [modId, name] = regName.split(':', 2)
	// let lang = await _load(`../../../data/lang/${modId}.json`)
	let lang = await _load(`lang/${modId}.json`)
	if (!lang) lang = {}
	localStorage.setItem(`docs.translation.${modId}`, JSON.stringify(lang))
}

const lang = {
	load: _load_lang_def,
	get: async regName => {
		const [modId, name] = regName.split(':', 2)
		let data = null
		while (!data) {
			await _load_lang_def(regName)
			data = JSON.parse(localStorage.getItem(`docs.translation.${modId}`))
		}
		if (!Object.keys(data).includes(name))
			return regName
		return data[name]
	}
}
const utils = {
	imagePath: regName => `/img/items/${regName.replace(':', '/')}.png`,
	objToArr: obj => {
		const result = []
		Object.keys(obj).forEach(key => {
			result.push([key, obj[key]])
		})
		return result
	}
}

$.recipes = {
	lang,
	load: async () => {
		const page_recipes_ids = {}
		const page_recipes_data = {}

		const recipes = $('[data-recipe-id]')

		for (const recipe of recipes) {
			const id = recipe.dataset.recipeId.replace(/\./, '/')
			page_recipes_ids[id] = recipe
			const file = `recipes/${id.replace(':', '/')}.json`
			page_recipes_data[id] = await _load(file)
		}

		return {ids: page_recipes_ids, recipes: page_recipes_data}
	},
	utils
}
