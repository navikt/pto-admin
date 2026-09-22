import React, {useState} from "react";
import {batchStartOppfolgingMedForrigeAoKontor} from "../../api/veilarboppfolging";
import {Card} from "../../component/card/card";
import { Button, Heading, Textarea, TextField } from '@navikt/ds-react';


export const StartOppfolging = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const postStartOppfolging = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const aktorIdList = formData.get('aktorIdList') as string;
        setIsLoading(true);
        await batchStartOppfolgingMedForrigeAoKontor({ aktorIdList: aktorIdList.split(',').map(it => it.trim()) });
        setIsLoading(false);
    };

    return (
		<div className="p-4 bg-gray-white">
			<Card>
				<Heading size="medium">Batch start oppfølging med forrige ao-kontor</Heading>
				<form className="space-y-4" onSubmit={postStartOppfolging}>
					<Textarea name="aktorIdList" label={'AktorId (kommaseparert)'} />
					<Button loading={isLoading} disabled={isLoading}>
						Send
					</Button>
				</form>
			</Card>
		</div>
	);

}