import { createSlice, createAsyncThunk, SerializedError } from '@reduxjs/toolkit';
import { getMenuItemsApi } from '@api';
import { TMenuItem } from '@utils-types';
import { RootState } from '../store';

export const fetchMenuItems = createAsyncThunk(
  'menu/fetch',
  async () => {
    const response = await getMenuItemsApi();
    return response;
  }
);

export type IMenuState = {
  items: TMenuItem[];
  breads: TMenuItem[];
  dishes: TMenuItem[];
  sauces: TMenuItem[];
  isLoading: boolean;
  error: null | SerializedError;
};

export const initialState: IMenuState = {
  items: [],
  breads: [],
  dishes: [],
  sauces: [],
  isLoading: true,
  error: null
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.breads = action.payload.filter((item) => item.category === 'bread');
        state.dishes = action.payload.filter((item) => item.category === 'dish');
        state.sauces = action.payload.filter((item) => item.category === 'sauce');
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      });
  }
});

export const selectMenuItems = (state: RootState) => state.menu.items;
export const selectMenuItem = (state: RootState, id: string) =>
  state.menu.items.find((x) => x.itemId === id);
export const selectBreads = (state: RootState) => state.menu.breads;
export const selectDishes = (state: RootState) => state.menu.dishes;
export const selectSauces = (state: RootState) => state.menu.sauces;
export const selectIsLoading = (state: RootState) =>
  state.menu.isLoading;

export default menuSlice.reducer;