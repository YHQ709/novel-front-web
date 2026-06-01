
export const goToAnchor = (id) => {
  var anchor = document.getElementById(id);
  // chrome
  document.body.scrollTop = anchor.offsetTop;
  // firefox
  document.documentElement.scrollTop = anchor.offsetTop;
  // safari
  window.pageYOffset = anchor.offsetTop;
}

export const getQueryObject = (url) => {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

export const getQueryString = (name) => {
  return getQueryObject(window.location.href)[name];
}

export const getLocal = (name) => {
  return localStorage.getItem(name)
}

export const setLocal = (name, value) => {
  localStorage.setItem(name, value)
}

export const addDay = (days) => {
  //创建date
  let nowDate = new Date();
  //添加天数
  nowDate.setDate(nowDate.getDate() + days);
  //返回
  return nowDate
}

export const addMonth= (months) => {
  //创建date
  let nowDate = new Date();
  //添加周数
  nowDate.setMonth(nowDate.getMonth() + months);
  //返回
  return nowDate
}

export const addYear= (years) => {
  //创建date
  let nowDate = new Date();
  //添加年数
  nowDate.setMonth(nowDate.getYear() + years);
  //返回
  return nowDate
}

export const dateFormat = (fmt, date) => {
  let ret;
  const opt = {
      "Y+": date.getFullYear().toString(),        // 年
      "m+": (date.getMonth() + 1).toString(),     // 月
      "d+": date.getDate().toString(),            // 日
      "H+": date.getHours().toString(),           // 时
      "M+": date.getMinutes().toString(),         // 分
      "S+": date.getSeconds().toString()          // 秒
      // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
      ret = new RegExp("(" + k + ")").exec(fmt);
      if (ret) {
          fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
      }
  }
  return fmt;
}

export const timeAgo = (dateTime) => {
  if (!dateTime) return '';
  
  const date = new Date(dateTime);
  const now = new Date();
  
  // 计算时间差（秒）
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return '刚刚';
  if (seconds < 3600) return Math.floor(seconds / 60) + '分钟前';
  if (seconds < 86400) return Math.floor(seconds / 3600) + '小时前';
  if (seconds < 2592000) return Math.floor(seconds / 86400) + '天前';
  if (seconds < 31536000) return Math.floor(seconds / 2592000) + '个月前';
  
  return Math.floor(seconds / 31536000) + '年前';
}


/**
 * 将HTML格式转换为纯文本格式（用于textarea显示）
 * 例如： "内容<br/>内容" -> "内容\n\n内容"
 */
export const htmlToPlainText = (html) => {
  if (!html) return '';

  return html
    // 替换<br/>标签为换行符
    .replace(/<br\s*\/?>/gi, '\n')
    // 替换&nbsp;为空格
    .replace(/&nbsp;/g, ' ')
    // 替换其他可能的HTML实体
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    // 处理多个连续换行（保留段落格式）
    .replace(/\n{3,}/g, '\n\n');
};

/**
 * 将纯文本格式转换为HTML格式（用于保存）
 * 例如： "内容\n\n内容" -> "内容<br/><br/>内容"
 */
export const plainTextToHtml = (text) => {
  if (!text) return '';

  return text
    // 处理段落开头的空格（通常表示首行缩进）
    .split('\n')
    .map(line => {
      // 处理行首空格（中文段落通常空两格）
      const indentMatch = line.match(/^(\s+)/);
      if (indentMatch) {
        const spaces = indentMatch[1].length;
        // 每两个空格替换为一个&quot； (中文全角空格)
        // 或者替换为&nbsp; (HTML空格实体)
        line = '&nbsp;'.repeat(spaces) + line.substring(spaces);
      }
      return line;
    })
    .join('<br/>')
    // 处理连续多个换行
    .replace(/(<br\/>){3,}/g, '<br/><br/>');
};


