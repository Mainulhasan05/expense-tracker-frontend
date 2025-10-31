import {
  googleLogin,
  emailLogin,
  emailRegister,
  getProfile,
  addTransaction,
  updateTransaction as updateTransactionAPI,
  getCategories,
  addCategory,
  getTransactions,
  deleteTransaction,
  deleteCategory,
  searchTransactions,
} from "./authAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  categories: [],
  transactions: [],
  tasks: [],
  loading: false,
  error: null,
};

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async ({ idToken }) => {
    return await googleLogin({ idToken });
  }
);

export const loginWithEmail = createAsyncThunk(
  "auth/loginWithEmail",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await emailLogin({ email, password });
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Login failed");
    }
  }
);

export const registerWithEmail = createAsyncThunk(
  "auth/registerWithEmail",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      return await emailRegister({ name, email, password });
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Registration failed");
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "auth/fetchCategories",
  async () => {
    return await getCategories();
  }
);

export const addNewCategory = createAsyncThunk(
  "auth/addNewCategory",
  async (data) => {
    return await addCategory(data);
  }
);

export const addNewTransaction = createAsyncThunk(
  "auth/addNewTransaction",
  async (data) => {
    return await addTransaction(data);
  }
);

export const fetchTransactions = createAsyncThunk(
  "auth/fetchTransactions",
  async (data) => {
    return await getTransactions(data);
  }
);

export const searchTransaction = createAsyncThunk(
  "auth/searchTransaction",
  async (data) => {
    return await searchTransactions(data);
  }
);

export const updateTransaction = createAsyncThunk(
  "auth/updateTransaction",
  async ({ id, ...data }) => {
    return await updateTransactionAPI(id, data);
  }
);

export const deleteTransactionItem = createAsyncThunk(
  "auth/deleteTransactionItem",
  async (data) => {
    return await deleteTransaction(data);
  }
);

export const deleteCategoryItem = createAsyncThunk(
  "auth/deleteCategoryItem",
  async (data) => {
    return await deleteCategory(data);
  }
);

export const fetchProfile = createAsyncThunk("auth/fetchProfile", async () => {
  return await getProfile();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.user;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(registerWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        // Don't set user on registration, they need to verify email first
      })
      .addCase(registerWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addNewCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories.push(action.payload);
      })
      .addCase(addNewCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addNewTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.transactions?.push(action.payload);
      })
      .addCase(addNewTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTransaction = action.payload?.transaction;
        if (updatedTransaction) {
          state.transactions.transactions = state.transactions?.transactions?.map(
            (item) => item._id === updatedTransaction._id ? updatedTransaction : item
          );
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTransactionItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransactionItem.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.transactions =
          state.transactions?.transactions?.filter(
            (item) => item._id !== action.payload?.transaction._id
          );
      })
      .addCase(deleteTransactionItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteCategoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (item) => item._id !== action.payload?.category._id
        );
      })
      .addCase(deleteCategoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(searchTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(searchTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default authSlice.reducer;
