export const rightsMapperData = {
  systemUserRead: 'system-user/read',
  systemUserReadDetails: 'system-user/read/details',
  systemUserCreate: 'system-user/create',
  systemUserUpdate: 'system-user/update',
  systemUserDelete: 'system-user/delete',
  systemUserBlock: 'system-user/block',

  translateRead: 'translate/read',
  translateReadDetails: 'translate/read/details',
  translateCreate: 'translate/create',
  translateUpdate: 'translate/update',
  translateDelete: 'translate/delete',

  rightsRead: 'rights/read',

  staffRead: 'staffs/read',
  staffReadDetails: 'staffs/read/details',
  staffCreate: 'staffs/create',
  staffUpdate: 'staffs/update',
  staffDelete: 'staffs/delete',

  offerRead: 'offer/read',
  offerReadDetails: 'offer/read/details',
  fileReadDetails: 'file/read/details',

  measurementRead: 'measurement/read',
  measurementReadDetails: 'measurement/read/details',
  measurementCreate: 'measurement/create',
  measurementUpdate: 'measurement/update',
  measurementDelete: 'measurement/delete',

  productCategoriesRead: 'productCategories/read',
  productCategoriesReadDetails: 'productCategories/read/details',
  productCategoriesCreate: 'productCategories/create',
  productCategoriesUpdate: 'productCategories/update',
  productCategoriesDelete: 'productCategories/delete',

  productRead: 'product/read',
  productReadDetails: 'product/read/details',
  productCreate: 'product/create',
  productUpdateOnlyBuyPrice: 'product/update/buy_price',
  productUpdateOnlySellPrice: 'product/update/sell_price',
  productUpdate: 'product/update',
  productDelete: 'product/delete',
}

export const rightsListData = [
  {
    code: rightsMapperData.systemUserRead,
    title: {
      hy: 'Դիտել համակարգի օգտվողների ցանկը',
      en: 'System users list view'
    }
  },
  {
    code: rightsMapperData.systemUserReadDetails,
    title: {
      hy: 'Դիտել համակարգի օգտվողի ամբողջական ինֆորմացիան',
      en: 'View system user details'
    }
  },
  {
    code: rightsMapperData.systemUserCreate,
    title: {
      hy: 'Ստեղծել նոր համակարգի օգտվող',
      en: 'Create new system user'
    }
  },
  {
    code: rightsMapperData.systemUserUpdate,
    title: {
      hy: 'Խմբագրել համակարգի օգտվողին',
      en: 'Update system user'
    }
  },
  {
    code: rightsMapperData.systemUserDelete,
    title: {
      hy: 'Ջնջել համակարգի օգտվողին',
      en: 'Delete system user'
    }
  },
  {
    code: rightsMapperData.systemUserBlock,
    title: {
      hy: 'Արգելափակել համակարգի օգտվողին',
      en: 'Block system user'
    }
  },
  {
    code: rightsMapperData.staffRead,
    title: {
      hy: 'Դիտել պաշտոնների ցանկը',
      en: 'Staffs list view'
    }
  },
  {
    code: rightsMapperData.staffReadDetails,
    title: {
      hy: 'Դիտել պաշտոնի ամբողջական ինֆորմացիան',
      en: 'View staff details'
    }
  },
  {
    code: rightsMapperData.staffCreate,
    title: {
      hy: 'Ստեղծել նոր պաշտոն',
      en: 'Create new staff'
    }
  },
  {
    code: rightsMapperData.staffUpdate,
    title: {
      hy: 'Խմբագրել պաշտոնը',
      en: 'Update staff'
    }
  },
  {
    code: rightsMapperData.staffDelete,
    title: {
      hy: 'Ջնջել պաշտոնը',
      en: 'Delete staff'
    }
  },
  {
    code: rightsMapperData.translateRead,
    title: {
      hy: 'Դիտել թարգմանությունների ցանկը',
      en: 'Translations list view'
    }
  },
  {
    code: rightsMapperData.translateReadDetails,
    title: {
      hy: 'Դիտել թարգմանության ամբողջական ինֆորմացիան',
      en: 'View translation details'
    }
  },
  {
    code: rightsMapperData.translateCreate,
    title: {
      hy: 'Ստեղծել նոր թարգմանություն',
      en: 'Create new translation'
    }
  },
  {
    code: rightsMapperData.translateUpdate,
    title: {
      hy: 'Խմբագրել թարգմանությունը',
      en: 'Update translation'
    }
  },
  {
    code: rightsMapperData.translateDelete,
    title: {
      hy: 'Ջնջել թարգմանությունը',
      en: 'Delete translation'
    }
  },
  {
    code: rightsMapperData.measurementRead,
    title: {
      hy: 'Դիտել չափման միավորների ցանկը',
      en: 'Measurements list view'
    }
  },
  {
    code: rightsMapperData.measurementReadDetails,
    title: {
      hy: 'Դիտել չափման միավորի ամբողջական ինֆորմացիան',
      en: 'View measurement details'
    }
  },
  {
    code: rightsMapperData.measurementCreate,
    title: {
      hy: 'Ստեղծել նոր չափման միավոր',
      en: 'Create new measurement'
    }
  },
  {
    code: rightsMapperData.measurementUpdate,
    title: {
      hy: 'Խմբագրել չափման միավորը',
      en: 'Update measurement'
    }
  },
  {
    code: rightsMapperData.measurementDelete,
    title: {
      hy: 'Ջնջել չափման միավորը',
      en: 'Delete measurement'
    }
  },
  {
    code: rightsMapperData.productCategoriesRead,
    title: {
      hy: 'Դիտել ապրանքացանկի կատեգորիաների ցանկը',
      en: 'Products categories list view'
    }
  },
  {
    code: rightsMapperData.productCategoriesReadDetails,
    title: {
      hy: 'Դիտել ապրանքացանկի կատեգորիաի ամբողջական ինֆորմացիան',
      en: 'View product category details'
    }
  },
  {
    code: rightsMapperData.productCategoriesCreate,
    title: {
      hy: 'Ստեղծել նոր ապրանքացանկի կատեգորիա',
      en: 'Create new product category'
    }
  },
  {
    code: rightsMapperData.productCategoriesUpdate,
    title: {
      hy: 'Խմբագրել ապրանքացանկի կատեգորիան',
      en: 'Update product category'
    }
  },
  {
    code: rightsMapperData.productCategoriesDelete,
    title: {
      hy: 'Ջնջել ապրանքացանկի կատեգորիան',
      en: 'Delete product category'
    }
  },
  {
    code: rightsMapperData.productRead,
    title: {
      hy: 'Դիտել ապրանքացանկը',
      en: 'Products list view'
    }
  },
  {
    code: rightsMapperData.productReadDetails,
    title: {
      hy: 'Դիտել ապրանքացանկի ամբողջական ինֆորմացիան',
      en: 'View product details'
    }
  },
  {
    code: rightsMapperData.productCreate,
    title: {
      hy: 'Ստեղծել նոր ապրանքացանկ',
      en: 'Create new product'
    }
  },
  {
    code: rightsMapperData.productUpdateOnlyBuyPrice,
    title: {
      hy: 'Խմբագրել ապրանքացանկի գնման գինը',
      en: 'Update product buy price'
    }
  },
  {
    code: rightsMapperData.productUpdateOnlySellPrice,
    title: {
      hy: 'Խմբագրել ապրանքացանկի վաճառքի գինը',
      en: 'Update product sell price'
    }
  },
  {
    code: rightsMapperData.productUpdate,
    title: {
      hy: 'Խմբագրել ապրանքացանկը',
      en: 'Update product'
    }
  },
  {
    code: rightsMapperData.productDelete,
    title: {
      hy: 'Ջնջել ապրանքացանկը',
      en: 'Delete product'
    }
  },
];
