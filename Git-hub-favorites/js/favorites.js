import { GitHubUser } from "./GithubUser.js"

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)

        this.load()
    }

    async add(value) {
        try {
            const userExist = this.entries.find(entry => entry.login === value)

            if (userExist) {
                throw new Error(`Usuário já cadastrado!`)
            }

            const user = await GitHubUser.search(value)

            if(user.login === undefined) {
                throw new Error(`Usuário não encontrado!`)
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        } 
        
        catch(error) {
            alert(error.message)
        }
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem(`@github-favorites:`, JSON.stringify(this.entries))
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = document.querySelector(`table tbody`)

        this.update()
        this.onAdd()
    }

    onAdd() {
        const addButton = this.root.querySelector(`.search button`)

        addButton.onclick = () => {
            const { value } = this.root.querySelector(`.search input`)

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach( user => {
            const row = this.createRow()

            row.querySelector(`.user img`).src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.login}`
            row.querySelector(`.user p`).textContent = `${user.name}`
            row.querySelector(`.user span`).textContent = `${user.login}`
            row.querySelector(`.repositories`).textContent = `${user.public_repos}`
            row.querySelector(`.followers`).textContent = `${user.followers}`
            row.querySelector(`.remove`).onclick = () => {
                const isOk = confirm(`Tem certeza que deseja deletar?`)

                if(isOk) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)
        })
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

    removeAllTr() {
        this.tbody.querySelectorAll(`tr`)
        .forEach((tr) => {
            tr.remove()
        })
    }
}
