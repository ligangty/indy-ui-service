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
package org.commonjava.indy.service.ui.util;

import org.hamcrest.CoreMatchers;
import org.junit.jupiter.api.Test;

import static org.commonjava.indy.service.ui.util.UrlUtils.replaceHostInUrl;
import static org.hamcrest.MatcherAssert.assertThat;

public class UrlUtilsTest
{
    @Test
    public void testReplaceHostInUrl()
    {
        final String url =
                "http://indy.indy.svc.cluster.local/api/browse/maven/remote/koji-c3p0-0.9.1.2-10_redhat_3.ep6.el6";

        assertThat( replaceHostInUrl( url, "localhost:8080" ), CoreMatchers.equalTo(
                "http://localhost:8080/api/browse/maven/remote/koji-c3p0-0.9.1.2-10_redhat_3.ep6.el6" ) );
    }
}
