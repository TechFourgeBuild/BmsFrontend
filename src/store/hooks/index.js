import { useDispatch, useSelector } from 'react-redux';

// Custom hook for dispatch
export const useAppDispatch = () => useDispatch();

// Custom hook for selector
export const useAppSelector = useSelector;