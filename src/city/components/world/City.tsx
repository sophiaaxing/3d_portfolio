import type { FC } from 'react';
import { districts, type DistrictId } from '../../data/districts';
import { Board } from './Board';
import { AwsDistrict } from './districts/Aws';
import { GoogleDistrict } from './districts/Google';
import { LabDistrict } from './districts/Lab';
import { NvidiaDistrict } from './districts/Nvidia';
import { RiceDistrict } from './districts/Rice';
import { StudioDistrict } from './districts/Studio';
import { DistrictHitArea, DistrictMarks, HoverLabel } from './Interaction';
import { People } from './life/People';
import { Stars } from './life/Stars';
import { Streetlights } from './life/Streetlights';
import { Traffic } from './life/Traffic';
import { Train } from './life/Train';
import { Plaza } from './Plaza';
import { Pad } from './primitives';
import { StaticBatch } from './StaticBatch';

const districtModels: Record<DistrictId, FC> = {
  google: GoogleDistrict,
  nvidia: NvidiaDistrict,
  aws: AwsDistrict,
  rice: RiceDistrict,
  lab: LabDistrict,
  studio: StudioDistrict,
};

export function City() {
  return (
    <group>
      <StaticBatch>
        <Board />
        <Plaza />
        {districts.map((district) => {
          const Model = districtModels[district.id];
          return (
            <group key={district.id} name={district.id} position={[district.position[0], 0, district.position[1]]}>
              <Pad size={district.padSize} />
              <Model />
              <DistrictMarks district={district} />
              <DistrictHitArea district={district} />
            </group>
          );
        })}
      </StaticBatch>
      <Traffic />
      <Streetlights />
      <People />
      <Train />
      <Stars />
      <HoverLabel />
    </group>
  );
}
