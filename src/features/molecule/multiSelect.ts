import type { MergedFeature, FeatureProps } from '../../common';
import { mergeFeatures } from '../../utils/mergeFeatures';
import { type AutocompleteFeature, autocomplete } from './autocomplete';
import { type InputFocusFeature, inputFocus } from '../atom/inputFocus';
import { type MultiInputFeature, multiInput } from '../atom/multiInput';

type MultiSelectFeature<T> = MergedFeature<
  T,
  [AutocompleteFeature<T>, InputFocusFeature<T>, MultiInputFeature<T>]
>;

const multiSelect = <T>(
  props: Pick<FeatureProps<T>, 'rovingText' | 'closeOnSelect'> = {}
): MultiSelectFeature<T> =>
  mergeFeatures(
    autocomplete<T>({ ...props, select: true, selectOnBlur: false }),
    inputFocus<T>(),
    multiInput<T>()
  );

export { type MultiSelectFeature, multiSelect };