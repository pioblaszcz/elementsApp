export const nameRules = [
    v => !!v || 'Nazwa jest wymagana',
    v => (v && v.length <= 16) || 'Nazwa musi być krótsza niż 16 znaków',
]

export const descriptionRules = [
    v => (v!==null && v.length <= 30) || 'Opis musi być krótszy niż 30 znaków',
]

export const serverIdRules = [
    v => v!==null || 'Podpięcie do serwera jest wymagane',
]
