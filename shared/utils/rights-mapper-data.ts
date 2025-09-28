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
    code: rightsMapperData.offerRead,
    title: {
      hy: 'Դիտել առաջարկները',
      en: 'Offers list view'
    }
  },
  {
    code: rightsMapperData.offerReadDetails,
    title: {
      hy: 'Դիտել առաջարկի ամբողջական ինֆորմացիան',
      en: 'View offer details'
    }
  },

  {
    code: rightsMapperData.productCategoriesRead,
    title: {
      hy: 'Դիտել ծրագրերի կատեգորիաների ցանկը',
      en: 'Apps categories list view'
    }
  },
  {
    code: rightsMapperData.productCategoriesReadDetails,
    title: {
      hy: 'Դիտել ծրագրի կատեգորիաի ամբողջական ինֆորմացիան',
      en: 'View App category details'
    }
  },
  {
    code: rightsMapperData.productCategoriesCreate,
    title: {
      hy: 'Ստեղծել նոր ծրագրի կատեգորիա',
      en: 'Create new App category'
    }
  },
  {
    code: rightsMapperData.productCategoriesUpdate,
    title: {
      hy: 'Խմբագրել ծրագրի կատեգորիան',
      en: 'Update App category'
    }
  },
  {
    code: rightsMapperData.productCategoriesDelete,
    title: {
      hy: 'Ջնջել ծրագրի կատեգորիան',
      en: 'Delete App category'
    }
  },
  {
    code: rightsMapperData.productRead,
    title: {
      hy: 'Դիտել ծրագրերը',
      en: 'Apps list view'
    }
  },
  {
    code: rightsMapperData.productReadDetails,
    title: {
      hy: 'Դիտել ծրագրի ամբողջական ինֆորմացիան',
      en: 'View App details'
    }
  },
  {
    code: rightsMapperData.productCreate,
    title: {
      hy: 'Ստեղծել նոր ծրագիր',
      en: 'Create new App'
    }
  },
  {
    code: rightsMapperData.productUpdate,
    title: {
      hy: 'Խմբագրել ծրագիրը',
      en: 'Update App'
    }
  },
  {
    code: rightsMapperData.productDelete,
    title: {
      hy: 'Ջնջել ծրագիրը',
      en: 'Delete App'
    }
  },
];
