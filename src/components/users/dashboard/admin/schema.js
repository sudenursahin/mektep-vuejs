import * as yup from 'yup'

const CourseSchema = {
    title: yup
        .string()
        .required('Ders başlığı zorunludur')
        .min(3, 'Ders başlığı en az 3 karakter olmalıdır'),
    description: yup
        .string()
        .required('Ders açıklaması zorunludur')
        .min(10, 'Ders açıklaması en az 10 karakter olmalıdır'),
    img: yup
        .string()
        .nullable(),
    rating: yup
        .number()
        .required('Ders seviyesi zorunludur')
        .min(1, 'Ders seviyesi 1-5 arasında olmalıdır')
        .max(5, 'Ders seviyesi 1-5 arasında olmalıdır'),
    category: yup
        .string()
        .required('İlim dalı seçimi zorunludur'),
    createdAt: yup
        .date()
        .required('Oluşturulma tarihi zorunludur'),
    summary: yup
        .string()
        .nullable(),
    content: yup.object().shape({
        pages: yup.array().of(yup.string()),
        totalPages: yup.number()
    }).nullable(),
    timestamp: yup
        .date()
        .nullable()
}

export default CourseSchema
