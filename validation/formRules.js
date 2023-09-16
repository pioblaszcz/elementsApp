export const nameRules = [
    v => !!v || 'Nazwa jest wymagana',
    v =>(v && v.replace(/\s/g, '').length > 0) || 'Nazwa nie może zawierać tylko spacji',
    v => (v && v.length <= 16) || 'Nazwa musi być krótsza niż 16 znaków',
]

export const descriptionRules = [
    v => (!v || v.length <= 30) || 'Opis musi być krótszy niż 30 znaków',
]

export const serverIdRules = [
    v => v!==null || 'Podpięcie do serwera jest wymagane',
]
