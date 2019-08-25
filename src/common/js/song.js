import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'
import jsonp from 'common/js/jsonp'
import {commonParams} from '../../api/config'

// import axios from 'axios'

export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }

  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

export async function createSong(musicData) {
  const songResult = await getPlaySongKey(musicData.songmid)
  const {midurlinfo, sip} = songResult.req_0.data
  // console.log(songResult)
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    // image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `https://api.bzqll.com/music/tencent/url?id=${musicData.songmid}&key=579621905`
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: sip[0] + midurlinfo[0].purl
  })
  // console.log(song)

  // return song
}

function getPlaySongKey(mid) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: `{"req_0":{"module":"vkey.GetVkeyServer","method":"CgiGetVkey","param":{"guid":"1933776370","songmid":["${mid}"],"songtype":[0],"uin":"0","loginflag":1,"platform":"20"}},"comm":{"uin":0,"format":"json","ct":24,"cv":0}}`
  })
  return jsonp(url, data, '')
}

// function _formatSongs(list) {
//   let result = []
//   list.forEach((item) => {
//     // console.log('item',item)
//     // 解构赋值-拿到item 下的 musicData 列表数据
//     let {musicData} = item
//     // ------------- 更新的加上vkey
//     getPlaySongKey(musicData.songmid).then((res) => {
//       const vkey = res.data.items[0].vkey
//       if (musicData.songid && musicData.albummid) {
//         result.push(creatSong(musicData, vkey))
//       }
//     })
//     // -------------
//     // console.log('musicData',musicData)
//     // if(musicData.songid && musicData.albummid){
//     //   result.push(CreatSong(musicData))
//     // }
//   })
//   return result
// }

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

