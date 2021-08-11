const isFile = (val) => {
  return val ? val.file instanceof File : false
}

const haveFile = (source) => {
  let rs = false
  Object.keys(source).forEach(key => {
    if (isFile(source[key])) {
      rs = true
      return false
    }
  })
  return rs
}

const isFileTypeField = (fieldInfos, key) => {
  const fileTypeFields = ['file upload', 'image upload']
  const meta = fieldInfos[key]
  return fileTypeFields.indexOf(meta.type) >= 0
}

const createParams = (source) => {
  return haveFile(source) ? new FormData() : {}
}

const appendParam = (params, key, value) => {
  if (value === undefined || value === null) {
    // undefined是新增模式，null是编辑模式服务端返回
    return
  }
  if (params instanceof FormData) {
    if (Array.isArray(value)) {
      params.append(`${key}[]`, value)
    } else {
      params.append(key, value)
    }
  } else {
    params[key] = value
  }
}

export function buildParams (source, fieldInfos, editMode) {
  const params = createParams(source)
  Object.keys(source).forEach(key => {
    const value = source[key]
    if (!isFileTypeField(fieldInfos, key)) {
      // 普通字段处理简单
      appendParam(params, key, value)
      return true
    }
    if (!editMode) {
      // 新增模式，有上传文件才填充
      value && appendParam(params, key, value.file)
    } else {
      // 编辑模式
      if (value) {
        // 有值的情况有2种：1. 上传新文件，value是File类型，2.保持不变，value是字符串类型
        // 上传新文件才需要填充
        isFile(value) && appendParam(params, key, value.file)
      } else {
        // 无值的情况，有可能是没上传，也可能是删除原文件，这种情况增加一个隐藏字段，让后端去判断删除
        appendParam(params, `__del__${key}`, true)
      }
    }
  })
  return params
}
