export interface Restaurant {
	blurhash: string,
	location: number[],
	name: string,
	online: boolean,
	launch_date: string,
	popularity: number
}

export interface Section {
	title: string,
	restaurants: Restaurant[]
}

export interface DiscoveryResult {
	sections: Section[]
}