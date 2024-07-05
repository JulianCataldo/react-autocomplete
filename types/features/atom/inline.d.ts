import type { Feature, GetPropsFunctions, FeatureProps } from '../../common';
type InlineFeature<T> = Feature<T, Pick<GetPropsFunctions<T>, 'getInputProps'>>;
declare const inline: <T>({ getFocusItem }: Pick<FeatureProps<T>, "getFocusItem">) => InlineFeature<T>;
export { type InlineFeature, inline };
