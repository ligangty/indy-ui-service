/**
 * Copyright (C) 2023 Red Hat, Inc. (https://github.com/Commonjava/indy-ui-service)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {TimeUtils} from "./TimeUtils.js";


describe('TimeUtils tests', () => {
  it('secondsToDuration test', () => {
    expect(TimeUtils.secondsToDuration(0, true)).toBe("default");
    expect(TimeUtils.secondsToDuration(0)).toBe("never");
    expect(TimeUtils.secondsToDuration()).toBe("never");
    expect(TimeUtils.secondsToDuration(100)).toBe('1m 40s');
    expect(TimeUtils.secondsToDuration(3600)).toBe('1h');
    expect(TimeUtils.secondsToDuration(3600 * 24)).toBe('24h');
    expect(TimeUtils.secondsToDuration(10 + 3600 * 5)).toBe('5h 10s');
    expect(TimeUtils.secondsToDuration(70 + 1800 * 4)).toBe('2h 1m 10s');
  });

  it('timestampToDateFormat test',() => {
    expect(TimeUtils.timestampToDateFormat()).toBe("never");
    expect(TimeUtils.timestampToDateFormat(0)).toBe("never");
    expect(TimeUtils.timestampToDateFormat(100)).not.toBe("never");
    expect(TimeUtils.timestampToDateFormat(1300009920114)).not.toBe("never");
  });

  it('timestampToCurrentAsDuration test', () => {
    expect(TimeUtils.timestampToCurrentAsDuration()).toBe("never");
    expect(TimeUtils.timestampToCurrentAsDuration(0)).toBe("never");
    expect(TimeUtils.timestampToCurrentAsDuration(2701009920114)).not.toBe("never");
  });
});
