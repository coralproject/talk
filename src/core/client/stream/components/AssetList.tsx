import * as React from "react";
import { StatelessComponent } from "react";

export interface AssetListProps {
  assets: ReadonlyArray<{ id: string; title: string | null }>;
}

const AssetList: StatelessComponent<AssetListProps> = props => {
  return (
    <div>
      {props.assets.map(asset => <div key={asset.id}>{asset.title}</div>)}
    </div>
  );
};

export default AssetList;
