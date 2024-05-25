import AbstractSource from './abstract.js'



export default new class SeaDex extends AbstractSource {

  name = 'SeaDex'

  description = 'Anime index for tracking the best releases of anime torrents across many trackers. Provides high accuracy searches.'

  /** @type {import('./types.js').Accuracy} */

  accuracy = 'High'



  url = atob('aHR0cHM6Ly9iZXRhLnJlbGVhc2VzLm1vZS9hcGkvY29sbGVjdGlvbnMvZW50cmllcy9yZWNvcmRz')



  /** @type {import('./types.js').SearchFunction} */

  async single ({ anilistId, titles }) {

    if (!anilistId) throw new Error('No anilistId provided')

    if (!titles?.length) throw new Error('No titles provided')

    const res = await fetch(`${this.url}?page=1&perPage=1&filter=alID%3D%22${anilistId}%22&skipTotal=1&expand=trs`)



    /** @type {import('./types.js').Seadex} */

    const { items } = await res.json()



    if (!items[0]?.expand?.trs?.length) return []



    const { trs } = items[0].expand



    return trs.filter(({ infoHash }) => infoHash !== '<redacted>').map(torrent => {

      return {

        hash: torrent.infoHash,

        link: torrent.infoHash,

        title: `[${torrent.releaseGroup}] ${titles[0]} ${torrent.dualAudio ? 'Dual Audio' : ''}`,

        size: torrent.files.reduce((prev, curr) => prev + curr.length, 0),

        type: torrent.isBest ? 'best' : 'alt',

        date: new Date(torrent.created),

        seeders: 0,

        leechers: 0,

        downloads: 0,

        verified: true

      }

    })

  }



  batch = this.single

  movie = this.single

}()
