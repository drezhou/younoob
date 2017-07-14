const regex = {

  regex: /\s[-–]\s/,

  editTitle: (str) => {
    let seperator = " - ";
    if (str.includes(seperator)){
      return str.split(regex.regex)[1];
    } else {
      return str
    }
  },

  editArtist: (str) => {
    const vevo = 'VEVO';
    if (str.includes(vevo)){

      let x = str.replace(/VEVO/g,'');
      return x.replace(/([A-Z])/g, ' $1');
    } else {
      return str;
    }
  },

  editDuration: (str) => {
    let x = str.replace(/PT/g, '');
    // let y = x.replace(/M/g, ':');
    let seconds = x.substr(x.indexOf("M") + 1);

    let z = seconds.replace(/S/g, '');
    if (!z) {
      z = '00';
    } else if (z.toString().length === 1){
      z = "" + z + 0;
    }

    let minutes = x.substr(0, x.indexOf('M'));

    return minutes + ':' + z;
  },

  editPlayCount: (str) => {
    return str.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
  },

  truncate: (str, length, ending) => {
    if (length == null) {
      length = 50;
    }
    if (ending == null) {
      ending = '...';
    }
    if (str.length > length) {
      return str.substring(0, length - ending.length) + ending;
    } else {
      return str;
    }
  }

}

export function expiry(){
  let today = new Date();
  let expiryDate = new Date();
  expiryDate.setYear(today.getFullYear()+10);
  return expiryDate;
}

export default regex;
