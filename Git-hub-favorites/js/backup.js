export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json())
        .then(({ login, name, public_repos, followers }) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }

}

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

        GithubUser.search('victornery'). then( user => console.log(user))
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    async add(username) {
        try {
            const user = await GithubUser.search(username)

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!')
            } } catch(error) {
                alert(error.message)
            }
        
    }

    delete(user) {
        const filterEntries = this.entries
        .filter(entry => entry.login !== user.login)

        this.entries = filterEntries
        this.update()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')

        this.update()
        this.onAdd()
    }

    update() {
        this.removeAlltr()

        this.entries.forEach( user => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.login}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja apagar o usuário?')
                if(isOk) {
                    this.delete(user)
                }

            }

            this.tbody.append(row)
        }) 
        
    }

    onAdd() {
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    createRow() {
        const tr = document.createElement(`tr`)

        tr.innerHTML = `
                    <td class="user">
                        <img src="https://github.com/mmaiaf.png" alt="Imagem de mmaiaf">
                        <a href="https://github.com/mmaiaf">
                            <p>Matheus Maia</p>
                            <span>mmaiaf</span>
                        </a>
                    </td>
                    <td class="repositories">
                        3
                    </td>
                    <td class="followers">
                        11
                    </td>
                    <td>
                        <button class="remove">&times;</button>
                    </td>
        `
        return tr
    }

    removeAlltr() {
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        });
    }
}