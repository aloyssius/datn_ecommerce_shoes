import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Box, Divider, Card, Checkbox, Grid, Stack, TextField, Typography, MenuItem } from '@mui/material';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import useFetch from '../../../../hooks/useFetch';
import { ADMIN_API } from '../../../../api/apiConfig';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useConfirm from '../../../../hooks/useConfirm'
import useNotification from '../../../../hooks/useNotification';
// components
import Iconify from '../../../../components/Iconify';
import {
  FormProvider,
  RHFSwitch,
  RHFEditor,
  RHFTextField,
} from '../../../../components/hook-form';
import Label from '../../../../components/Label';
import { ProductStatusTab, AttributeStatus } from '../../../../constants/enum';
import { convertProductStatusBoolean } from '../../../../utils/ConvertEnum';
import ProductNewEditColorSize from './ProductNewEditColorSize';
import { IconArrowDownAutocomplete } from '../../../../components/IconArrow';
import ProductNewEditVariant from './ProductNewEditVariant';
import { formatNumber } from '../../../../utils/formatCurrency';

// ----------------------------------------------------------------------

const IMAGE_MIN_LENGTH = 4;

const LabelStyleDescription = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
}));

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(0.5),
}));

const LabelStyleHeader = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.black,
  fontSize: 16.5,
}));

const filter = createFilterOptions();

ProductNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object,
};

export default function ProductNewEditForm({ isEdit, currentProduct, onUpdateData }) {

  console.log(currentProduct);

  const [variants, setVariants] = useState([]);

  const { onOpenSuccessNotify } = useNotification();

  const { id } = useParams();

  const { showConfirm, showConfirmCancel } = useConfirm();

  const { data, setData, formDataFile, post } = useFetch(ADMIN_API.product.attributes);

  const onFinish = (res, type, action) => {
    const lookup = {
      size: "sizes",
      color: "colors",
      brand: "brands",
    };

    const getNameObj = lookup[type] || "categories";
    setData(prevData => {
      if (prevData[getNameObj]) {
        return {
          ...prevData,
          [getNameObj]: [...prevData[getNameObj], { id: res.id, name: res.name, code: res.code || "" }]
        };
      }
      return prevData;
    });

    const lookupNotify = {
      size: "kích cỡ",
      color: "màu sắc",
      brand: "thương hiệu",
      category: "danh mục",
    };
    onOpenSuccessNotify(`Thêm mới ${lookupNotify[type]} thành công!`)
    action?.();
  };

  const handleCreateAttribute = (data, type, titleConfirm, action = () => { }) => {
    if (type !== "color") {
      const body = {
        name: data,
        status: AttributeStatus.en.IS_ACTIVE,
        type,
      };
      console.log(body)
      showConfirm(titleConfirm, () => post(ADMIN_API.product.postAttributes, body, (res) => onFinish(res, type, action)));
    }
    else {
      const bodyColor = {
        name: data?.name,
        code: data?.code,
        status: AttributeStatus.en.IS_ACTIVE,
        type,
      };
      showConfirm(titleConfirm, () => post(ADMIN_API.product.postAttributes, bodyColor, (res) => onFinish(res, type, action)));
    }
  }

  const navigate = useNavigate();

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Tên sản phẩm không được để trống'),
    code: Yup.string().required('Mã sản phẩm không được để trống'),
    brand: Yup.object().nullable().required('Bạn chưa chọn thương hiệu'),
    categorys: Yup.array().of(Yup.object()).min(1, "Vui lòng chọn ít nhất 1 danh mục").required(),
    colors: Yup.array().of(Yup.object()).min(1, "Vui lòng chọn ít nhất 1 màu sắc").required(),
    sizes: Yup.array().of(Yup.object()).min(1, "Vui lòng chọn ít nhất 1 kích cỡ").required(),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      code: currentProduct?.code || '',
      description: currentProduct?.description || '',
      categorys: currentProduct?.categories || [],
      brand: data.brands ? data.brands.find(item => item.id === currentProduct?.brandId) : null,
      status: convertProductStatusBoolean(currentProduct?.status),
      colors: currentProduct?.colors || [],
      sizes: currentProduct?.sizes || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { isSubmitted },
  } = methods;

  const values = watch();

  const { colors, sizes, name, code, brand, categorys, description, status } = values;

  useEffect(() => {
    if (isEdit && currentProduct) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentProduct]);

  const isDefault =
    name === "" &&
    code === "" &&
    description === "" &&
    brand === null &&
    status === true &&
    categorys.length === 0 &&
    variants?.length === 0;

  const currentVariantImages = variants?.flatMap(variant => variant.images.map(image => {
    return { ...image };
  }));

  const currentProductImages = currentProduct?.variants?.flatMap(variant => variant.images.map(image => {
    return { ...image };
  }));

  const oldProductItems = currentProduct?.variants?.flatMap(variant => variant.variantItems.map(variantItem => {
    return {
      ...variantItem,
    };
  }));

  const newProductItems = variants?.flatMap(variant => variant.variantItems.map(variantItem => {
    return {
      ...variantItem,
    };
  }));
  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };

  const isNotDefaultEdit =
    name?.trim() !== currentProduct?.name ||
    code?.trim() !== currentProduct?.code ||
    stripHtml(description?.trim()) !== currentProduct?.description ||
    brand?.id !== currentProduct?.brandId ||
    status !== (currentProduct?.status === ProductStatusTab.en.IS_ACTIVE) ||
    compareArrays(currentProduct?.categories, categorys, "id") ||
    // compareArrays(currentProduct?.colors, colors, "id") ||
    // compareArrays(currentProduct?.sizes, sizes, "id") ||
    compareArrayValues(oldProductItems, newProductItems, "quantity") ||
    compareArrayValues(oldProductItems, newProductItems, "status") ||
    compareArrayValues(oldProductItems, newProductItems, "price") ||
    compareArrayValues(currentProductImages, currentVariantImages, "isDefault") ||
    compareArrays(oldProductItems, newProductItems, "id") ||
    compareArrays(currentProductImages, currentVariantImages, "path");

  const handleCancel = () => {
    if (!isDefault && !isEdit) {
      showConfirmCancel(`Xác nhận hủy bỏ thêm mới?`, "Tất cả thay đổi của bạn sẽ không được lưu!", () => navigate(PATH_DASHBOARD.product.list))
      return;
    }
    if (isNotDefaultEdit && isEdit) {
      showConfirmCancel(`Xác nhận hủy bỏ cập nhật?`, "Tất cả thay đổi của bạn sẽ không được lưu!", () => navigate(PATH_DASHBOARD.product.list))
      return;
    }
    navigate(PATH_DASHBOARD.product.list)
  }

  const onFinishSaveProduct = (data) => {
    console.log(data);
    onOpenSuccessNotify(`${!isEdit ? "Thêm mới " : "Cập nhật "} sản phẩm thành công!`)
    if (!isEdit) {
      navigate(PATH_DASHBOARD.product.edit(data?.id))
    }
    else {
      onUpdateData(data);
      setFirstFill(false);
    }
  }

  const onSubmit = async (data) => {

    const categoryIds = data?.categorys?.map((item) => item.id);
    const brandId = data?.brand?.id;

    const { colors, sizes, brand, categorys, ...newData } = data;

    const productItems = variants.flatMap(variant => variant.variantItems.map(variantItem => {
      const { sizeName, ...rest } = variantItem;

      return {
        ...rest,
        price: formatNumber(variant.price),
        quantity: Number(rest.quantity),
        sku: `${code}-${variant?.colorName?.toUpperCase()}`
      };
    }));

    const productItemsNeedRemove = oldProductItems?.filter((item) => {
      return !productItems?.some((productItem) => productItem?.id === item.id);
    }).map((item) => item.id);

    const imagesNeedRemove = currentProductImages?.filter((item) => {
      return !currentVariantImages?.some((image) => image?.id === item.id);
    }).map((item) => item.id);

    const imagesCloudNeedRemove = currentProductImages?.filter((item) => {
      return !currentVariantImages?.some((image) => image?.id === item.id);
    }).map((item) => item.publicId);

    const images = variants.flatMap((variant) =>
      variant.images.map((image) => image)
    );

    const imageFiles = variants?.flatMap((variant) =>
      variant?.imageFiles?.map((image) => image)
    );

    const imagesNeedCreate = images.filter((item) => !item?.id);

    const isErrorValidateProductItems = productItems.some((item) => !item.price) || variants.some((variant) =>
      variant.images.length < IMAGE_MIN_LENGTH) || variants.some((variant) => variant.images.every((image) => !image?.isDefault));

    if (!isErrorValidateProductItems) {
      const body = {
        ...newData,
        productItemsNeedRemove,
        imagesNeedRemove,
        imagesNeedCreate,
        imagesCloudNeedRemove,
        categoryIds,
        brandId,
        id,
        images,
        productItems,
        status: newData.status ? ProductStatusTab.en.IS_ACTIVE : ProductStatusTab.en.UN_ACTIVE,
      }
      console.log(body)

      if (!isEdit) {
        const formData = new FormData();
        imageFiles.forEach((file) => {
          const blobWithCustomFileName = new Blob([file], { type: 'application/octet-stream' });
          formData.append('files[]', blobWithCustomFileName, file.name);
        });
        formData.append('data', JSON.stringify(body));

        showConfirm("Xác nhận thêm mới sản phẩm?", () => formDataFile(ADMIN_API.product.post, formData, (res) => onFinishSaveProduct(res)));
      }
      else {
        const formData = new FormData();
        const imageFilesFiltered = imageFiles.filter((item) => !item?.id);
        imageFilesFiltered.forEach((file) => {
          const blobWithCustomFileName = new Blob([file], { type: 'application/octet-stream' });
          formData.append('files[]', blobWithCustomFileName, file.name);
        });
        formData.append('data', JSON.stringify(body));
        formData.append('_method', 'PUT');
        showConfirm("Xác nhận cập nhật sản phẩm?", () => formDataFile(ADMIN_API.product.put, formData, (res) => onFinishSaveProduct(res)));
      }

    }
  };

  const addValueToArrayIfNotExits = (data, type, titleConfirm) => {
    handleCreateAttribute(data, type, titleConfirm)
  }

  const addValueStrToArray = (list, value, currentArr, field, titleConfirm, type) => {
    if (list.some((item) => item.name === value)) {
      const obj = list.find((item) => item.name === value);
      const newArr = [...currentArr, obj];
      field.onChange(newArr);
    }
    else {
      addValueToArrayIfNotExits(value, type, titleConfirm);
    }
  }

  const [isRemoveVariant, setIsRemoveVariant] = useState(false);

  useEffect(() => {
    if (isRemoveVariant) {
      const updatedColors = colors.filter((color) => {
        const foundVariant = variants.find((variant) => variant.colorId === color.id);
        return foundVariant;
      });
      setValue('colors', updatedColors);

      const updatedSizes = sizes.filter((size) => {
        return variants.some((variant) => {
          return variant.variantItems.some((variantItem) => variantItem.sizeId === size.id);
        });
      });
      setValue('sizes', updatedSizes);
    }
  }, [isRemoveVariant]);

  const handleRemoveColorVariant = useCallback((colorId) => {
    setVariants((prevVariants) => prevVariants.filter((variant) => variant.colorId !== colorId));
    setIsRemoveVariant(true);
  }, []);

  const handleRemoveSizes = useCallback((colorId, sizeIds) => {
    setVariants(prevVariants => {
      const updatedVariants = prevVariants.map(variant => {

        if (variant.colorId === colorId) {
          const updatedVariantItems = variant.variantItems.filter(size => !sizeIds.includes(size.sizeId));
          return {
            ...variant,
            key: variant.key + 1,
            variantItems: updatedVariantItems,
          };
        }
        return variant;
      });

      return updatedVariants.filter((v) => v.variantItems.length > 0);
    });
    setIsRemoveVariant(true);
  }, []);

  const handleRemoveSize = useCallback((colorId, sizeId) => {
    setVariants(prevVariants => {
      const updatedVariants = prevVariants.map(variant => {

        if (variant.colorId === colorId) {
          const updatedVariantItems = variant.variantItems.filter(size => size.sizeId !== sizeId);
          return {
            ...variant,
            key: variant.key + 1,
            variantItems: updatedVariantItems,
          };
        }
        return variant;
      });

      return updatedVariants.filter((v) => v.variantItems.length > 0);
    });
    setIsRemoveVariant(true);
  }, []);

  const handleUpdateSizeQuantity = (colorId, sizeId, quantity) => {
    setVariants((prevVariants) => {
      const updatedVariants = prevVariants.map((variant) => {
        if (variant.colorId === colorId) {
          const updatedVariantItems = variant.variantItems.map(
            (variantItem) => {
              if (variantItem.sizeId === sizeId) {
                return {
                  ...variantItem,
                  quantity,
                };
              }
              return variantItem;
            }
          );
          return {
            ...variant,
            key: variant.key + 1,
            variantItems: updatedVariantItems,
          };
        }
        return variant;
      });

      return updatedVariants;
    });
  }

  const handleUpdateSizePrice = (colorId, price) => {
    setVariants((prevVariants) => {
      const updatedVariants = prevVariants.map((variant) => {
        if (variant.colorId === colorId) {
          const updatedVariantItems = variant.variantItems.map(
            (variantItem) => {
              return {
                ...variantItem,
                price,
              };
            }
          );
          return {
            ...variant,
            price,
            key: variant.key + 1,
            variantItems: updatedVariantItems,
          };
        }
        return variant;
      });

      return updatedVariants;
    });
  }

  const handleUpdateImageDefault = useCallback((colorId, path) => {
    setVariants((prevVariants) => {
      const updatedVariants = prevVariants.map((variant) => {
        if (variant.colorId === colorId) {

          const updatedImagesVariant = variant.images.map((image) => {
            if (image.path === path) {
              return {
                ...image,
                isDefault: true,
                colorId: variant.colorId,
              }
            }
            return {
              ...image,
              isDefault: false,
              colorId: variant.colorId,
            }
          })

          return {
            ...variant,
            key: variant.key + 1,
            images: updatedImagesVariant,
          };
        }
        return variant;
      });

      console.log(updatedVariants);
      return updatedVariants;
    });
  }, []);

  const handleUpdateSizeStatus = (colorId, sizeId, status) => {
    setVariants((prevVariants) => {
      const updatedVariants = prevVariants.map((variant) => {
        if (variant.colorId === colorId) {
          const updatedVariantItems = variant.variantItems.map(
            (variantItem) => {
              if (variantItem.sizeId === sizeId) {
                return {
                  ...variantItem,
                  status: status === true ? ProductStatusTab.en.IS_ACTIVE : ProductStatusTab.en.UN_ACTIVE,
                };
              }
              return variantItem;
            }
          );
          return {
            ...variant,
            key: variant.key + 1,
            variantItems: updatedVariantItems,
          };
        }
        return variant;
      });

      return updatedVariants;
    });
  }

  const handleUpdateSizeImages = (colorId, images) => {
    setVariants((prevVariants) => {
      const updatedVariants = prevVariants.map((variant) => {
        if (variant.colorId === colorId) {

          const updatedImagesVariant = images.map((item) => {
            const matchedImage = variant.images.find((image) => image.path === item.path);

            if (matchedImage) {
              return {
                ...matchedImage,
              }
            }

            return {
              ...item,
              isDefault: false,
              colorId: variant.colorId,
            };
          })

          return {
            ...variant,
            key: variant.key + 1,
            images: updatedImagesVariant,
            imageFiles: images,
          };
        }
        return variant;
      });
      console.log(updatedVariants);
      return updatedVariants;
    });
  }

  const handleUpdateSize = useCallback((typeUpdate, colorId, sizeId, value) => {
    if (typeUpdate === 'quantity') {
      handleUpdateSizeQuantity(colorId, sizeId, value);
    }
    if (typeUpdate === 'status') {
      handleUpdateSizeStatus(colorId, sizeId, value);
    }
    if (typeUpdate === 'price') {
      handleUpdateSizePrice(colorId, value);
    }
    if (typeUpdate === 'images') {
      handleUpdateSizeImages(colorId, value);
    }
  }, []);

  const [firstFill, setFirstFill] = useState(false);

  useEffect(() => {
    if (isRemoveVariant) {
      setIsRemoveVariant(false);
      return;
    }

    const hasVariant = colors?.length > 0 && sizes?.length > 0;

    if (!hasVariant) {
      setVariants([]);
      return;
    }

    if (isEdit && currentProduct?.variants?.length !== 0 && !firstFill) {
      // setVariants(currentProduct?.variants);
      setVariants(JSON.parse(JSON.stringify(currentProduct?.variants))); // ??
      setFirstFill(true);
      return;
    }

    setVariants((prevVariants) => {
      const colorMap = new Map();
      colors.forEach((color) => {
        colorMap.set(color.id, {
          key: 0,
          colorId: color.id,
          colorName: color.name,
          price: 0,
          images: [],
          imageFiles: [],
          variantItems: sizes.map((size) => ({
            colorId: color.id,
            sizeId: size.id,
            quantity: 0,
            price: 0,
            status: ProductStatusTab.en.IS_ACTIVE,
            sizeName: size.name,
          })),
        });
      });

      const updatedVariants = [...prevVariants];

      updatedVariants.forEach((existingVariant) => {
        const newVariant = colorMap.get(existingVariant.colorId);
        if (newVariant) {
          const newVariantItemsSet = new Set(newVariant.variantItems.map((item) => item.sizeId));
          const existingVariantItemsSet = new Set(existingVariant.variantItems.map((item) => item.sizeId));

          // Add new variantItems
          newVariant.variantItems.forEach((newItem) => {
            if (!existingVariantItemsSet.has(newItem.sizeId)) {
              existingVariant.variantItems.push(newItem);
            }
          });

          // Remove old variantItems
          existingVariant.variantItems = existingVariant.variantItems.filter((item) =>
            newVariantItemsSet.has(item.sizeId));

          existingVariant.key += 1;
          colorMap.delete(existingVariant.colorId);
        }
      });

      // Add remaining new variants
      colorMap.forEach((newVariant) => {
        updatedVariants.push(newVariant);
      });

      // Remove variants that are no longer needed
      return updatedVariants.filter((variant) =>
        colors.some((color) => color.id === variant.colorId)
      );
    });

  }, [colors, sizes]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <Card sx={{ p: 3 }} className="card">

              <LabelStyleHeader>Thông tin sản phẩm</LabelStyleHeader>
              <Stack spacing={3} sx={{ py: 2 }}>
                <RHFTextField
                  name="name"
                  topLabel="Tên sản phẩm"
                  placeholder="Nhập tên sản phẩm (tối đa 100 ký tự)"
                  isRequired
                />
                <RHFTextField name="code" topLabel="Mã sản phẩm" placeholder="Nhập mã sản phẩm (tối đa 20 ký tự)" isRequired />

                <div>
                  <LabelStyleDescription>Mô tả</LabelStyleDescription>
                  <RHFEditor simple placeholder="Nhập mô tả sản phẩm..." name="description" />
                </div>
              </Stack>
            </Card>

            {!isEdit &&
              <Card sx={{ p: 3 }} className="card">
                <LabelStyleHeader>Màu sắc & kích cỡ</LabelStyleHeader>
                <Stack spacing={3} sx={{ py: 2 }}>
                  <ProductNewEditColorSize data={data} onCreateAttribute={handleCreateAttribute} />
                </Stack>
              </Card>
            }

            <Card sx={{ p: 3 }} className="card">
              <LabelStyleHeader>Phiên bản sản phẩm</LabelStyleHeader>
              <Stack spacing={3} sx={{ py: 2 }}>
                <ProductNewEditVariant
                  variants={variants}
                  isSubmitted={isSubmitted}
                  onRemoveColor={handleRemoveColorVariant}
                  onRemoveSize={handleRemoveSize}
                  onRemoveSizes={handleRemoveSizes}
                  onUpdateSize={handleUpdateSize}
                  onUpdateImageDefault={handleUpdateImageDefault}
                  isEdit={isEdit}
                />

                {!variants?.length > 0 &&
                  <Stack spacing={3} sx={{ py: 1 }}>
                    <Typography variant='subtitle2' sx={{ fontSize: 17, color: 'text.disabled', textAlign: 'center' }}>Chưa có dữ liệu</Typography>
                  </Stack>
                }
              </Stack>
            </Card>
          </Stack>

        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={3}>

            <Card sx={{ p: 3 }} className='card'>
              <LabelStyleHeader>Phân loại</LabelStyleHeader>
              <Stack spacing={3} sx={{ py: 2 }}>

                <Controller
                  name='categorys'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Grid>
                      <LabelStyle>
                        Danh mục <span className="required">*</span>
                      </LabelStyle>
                      <Autocomplete
                        {...field}
                        selectOnFocus
                        disableCloseOnSelect
                        multiple
                        clearOnBlur
                        handleHomeEndKeys
                        fullWidth
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        freeSolo
                        forcePopupIcon
                        popupIcon={<IconArrowDownAutocomplete />}
                        size='small'
                        getOptionLabel={(option) => {
                          if (typeof option === 'string') {
                            return option;
                          }
                          if (option.inputValue) {
                            return option.inputValue;
                          }
                          return option.name;
                        }}
                        filterOptions={(options, params) => {
                          const filtered = filter(options, params);

                          const { inputValue } = params;
                          const isExisting = options.some((option) => inputValue === option.name);
                          if (inputValue?.trim() !== '' && !isExisting) {
                            filtered.push({
                              inputValue,
                            });
                          }

                          return filtered;
                        }}
                        onChange={(event, newValue) => {
                          const currentArr = getValues('categorys');
                          if (newValue.some((item) => typeof item === 'string')) {
                            const valueStr = newValue.find((item) => typeof item === 'string');
                            const titleConfirm = `${`Xác nhận thêm mới danh mục`} '${valueStr}'?`;
                            addValueStrToArray(data?.categories, valueStr, currentArr, field, titleConfirm, "category");
                          } else if (newValue && newValue?.some((item) => item?.inputValue)) {
                            const value = newValue?.find((item) => item?.inputValue)?.inputValue;
                            const titleConfirm = `${`Xác nhận thêm mới danh mục`} '${value}'?`;
                            addValueToArrayIfNotExits(value, "category", titleConfirm)
                          } else {
                            field.onChange(newValue);
                          }
                        }}
                        options={data?.categories || []}
                        renderOption={(props, option, { selected }) => (
                          <MenuItem
                            {...props}
                            key={option.id}
                            value={option.id}
                            sx={{
                              typography: 'body2',
                              height: 36,
                            }}
                          >
                            {option.inputValue ? (
                              <Stack spacing={1} direction="row">
                                <Iconify icon={'eva:plus-circle-outline'} sx={{ color: 'primary.main', width: 22, height: 22 }} />
                                <Typography color='primary' sx={{ fontWeight: 'bold' }}>{`Thêm mới danh mục : "${option.inputValue}"`}</Typography>
                              </Stack>
                            ) : (
                              <>
                                {option.name}
                                <Checkbox size='small' checked={selected} sx={{ marginLeft: 'auto' }} />
                              </>
                            )}
                          </MenuItem>
                        )}
                        renderTags={(value, getTagProps) =>
                          value.map((option, index) => (
                            <span key={index} {...getTagProps({ index })}>
                              <Label
                                variant={'ghost'}
                                color={option?.id ? 'primary' : 'default'}
                              >
                                {option?.name}
                              </Label>
                            </span>
                          ))
                        }
                        renderInput={(params) => <TextField
                          {...params}
                          sx={{
                            '& fieldset': {
                              borderRadius: '6px',
                            },
                            "& .Mui-error": {
                              marginLeft: 0,
                            },
                          }}
                          placeholder={values.categorys?.length === 0 ? "Chọn danh mục" : ""}
                          error={!!error}
                          helperText={error?.message}
                        />}
                      />
                    </Grid>
                  )}
                />

                <Controller
                  name='brand'
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <Grid>
                      <LabelStyle>
                        Thương hiệu <span className="required">*</span>
                      </LabelStyle>
                      <Autocomplete
                        {...field}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        fullWidth
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        freeSolo
                        forcePopupIcon
                        popupIcon={<IconArrowDownAutocomplete />}
                        size='small'
                        getOptionLabel={(option) => {
                          if (typeof option === 'string') {
                            return option;
                          }
                          if (option.inputValue) {
                            return option.inputValue;
                          }
                          return option.name;
                        }}
                        filterOptions={(options, params) => {
                          const filtered = filter(options, params);

                          const { inputValue } = params;
                          const isExisting = options.some((option) => inputValue === option.name);
                          if (inputValue?.trim() !== '' && !isExisting) {
                            filtered.push({
                              inputValue,
                            });
                          }

                          return filtered;
                        }}
                        options={data?.brands || []}
                        onChange={(event, newValue) => {
                          if (typeof newValue === 'string') {
                            if (data?.brands?.some((item) => item.name === newValue)) {
                              field.onChange(data?.brands?.find((item) => item.name === newValue));
                            }
                            else {
                              const titleConfirm = `${`Xác nhận thêm mới thương hiệu`} '${newValue}'?`;
                              handleCreateAttribute(newValue, "brand", titleConfirm);
                            }
                          } else if (newValue && newValue.inputValue) {
                            const titleConfirm = `${`Xác nhận thêm mới thương hiệu`} '${newValue.inputValue}'?`;
                            handleCreateAttribute(newValue.inputValue, "brand", titleConfirm);
                          } else {
                            field.onChange(newValue);
                          }
                        }}
                        renderOption={(props, option) => (
                          <MenuItem
                            {...props}
                            key={option.id}
                            value={option.id}
                            sx={{
                              typography: 'body2',
                              height: 36
                            }}
                          >
                            {option.inputValue ? (
                              <Stack spacing={1} direction="row">
                                <Iconify icon={'eva:plus-circle-outline'} sx={{ color: 'primary.main', width: 22, height: 22 }} />
                                <Typography color='primary' sx={{ fontWeight: 'bold' }}>{`Thêm mới thương hiệu : "${option.inputValue}"`}</Typography>
                              </Stack>
                            ) : (
                              <>
                                {option.name}
                              </>
                            )}
                          </MenuItem>
                        )}
                        renderInput={(params) => <TextField
                          placeholder={"Chọn thương hiệu"}
                          {...params}
                          error={!!error}
                          helperText={error?.message}
                          sx={{
                            '& fieldset': {
                              borderRadius: '6px',
                            },
                            "& .Mui-error": {
                              marginLeft: 0,
                            },
                          }}
                        />}
                      />
                    </Grid>
                  )}
                />
              </Stack>
            </Card>

            <Card sx={{ p: 3 }} className="card">
              <RHFSwitch
                name="status"
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
                labelPlacement="start"
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Trạng thái
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {getValues('status') ? ProductStatusTab.vi.IS_ACTIVE : ProductStatusTab.vi.UN_ACTIVE}
                    </Typography>
                  </>
                }
              />
            </Card>

            <Stack spacing={2} direction="row" >
              <Button onClick={handleCancel} size="medium" sx={{ width: "100%" }} color="inherit" variant="contained">Hủy</Button>
              <Button type="submit" sx={{ width: "100%" }} size="medium" variant="contained" disabled={isEdit && !isNotDefaultEdit}>Lưu</Button>
            </Stack>

          </Stack>

        </Grid>
      </Grid>

      <Stack sx={{ mt: 3 }}>
        <Divider />
        <Stack spacing={2} direction="row" display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
          <Button onClick={handleCancel} size="medium" color="inherit" variant="contained">Hủy</Button>
          <Button type="submit" size="medium" variant="contained" disabled={!isNotDefaultEdit && isEdit}>Lưu</Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

function compareArrays(oldArray, newArray, property) {
  const newSet = new Set(newArray.map(item => item[property]));

  for (let i = 0; i < oldArray?.length; i += 1) {
    if (!newSet.has(oldArray[i][property])) {
      return true; // Một hoặc nhiều phần tử đã bị xóa
    }
  }

  for (let i = 0; i < newArray?.length; i += 1) {
    if (!oldArray.some(item => item[property] === newArray[i][property])) {
      return true; // Một hoặc nhiều phần tử đã được thêm
    }
  }

  return false;
}

function compareArrayValues(oldArray, newArray, property) {
  for (let i = 0; i < oldArray.length; i += 1) {
    const oldItem = oldArray[i];
    const newItem = newArray.find(item => item.id === oldItem.id);

    if (newItem && newItem[property] !== oldItem[property]) {
      return true;
    }
  }

  return false;
}
